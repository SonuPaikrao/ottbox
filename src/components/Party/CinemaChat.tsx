'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, User, Users, Hash } from 'lucide-react';

interface Message {
    user: string;
    text: string;
    timestamp: string;
    avatarColor?: string;
}

interface CinemaChatProps {
    partyId: string;
    username: string;
    hostName: string;
}

const AVATAR_COLORS = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500',
    'bg-purple-500', 'bg-pink-500', 'bg-yellow-500',
    'bg-indigo-500', 'bg-teal-500'
];

export default function CinemaChat({ partyId, username, hostName }: CinemaChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [users, setUsers] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [userColor] = useState(() => AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);

    useEffect(() => {
        const channel = supabase.channel(`party:${partyId}`, {
            config: {
                broadcast: { self: true },
                presence: { key: username },
            },
        });

        channel
            .on('broadcast', { event: 'CHAT' }, (payload) => {
                setMessages((prev) => [...prev, payload.payload as Message]);
            })
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState();
                const userList = Object.values(newState).flat().map((u: any) => u.key || 'Anonymous');
                setUsers([...new Set(userList)] as string[]);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ online_at: new Date().toISOString(), user: username });
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [partyId, username]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const newMessage: Message = {
            user: username,
            text: inputText.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatarColor: userColor
        };

        // Broadcast
        await supabase.channel(`party:${partyId}`).send({
            type: 'broadcast',
            event: 'CHAT',
            payload: newMessage,
        });

        setInputText('');
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900/80 backdrop-blur-md border-l border-white/10 relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/20">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="font-bold text-white text-lg tracking-wide flex items-center gap-2">
                        <Hash size={18} className="text-red-500" />
                        WATCH PARTY
                    </h2>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full text-xs font-medium text-green-400 border border-white/5">
                        <Users size={12} />
                        {users.length} Online
                    </div>
                </div>
                <p className="text-xs text-gray-400">Hosted by <span className="text-white font-semibold">@{hostName}</span></p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 opacity-50 pointer-events-none">
                        <User size={48} className="mb-2" />
                        <p className="text-sm">Waiting for messages...</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className="group animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg ${msg.avatarColor || 'bg-gray-500'}`}>
                                {msg.user.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-0.5">
                                    <span className={`text-xs font-bold truncate ${msg.user === username ? 'text-red-400' : 'text-gray-200'}`}>
                                        {msg.user}
                                    </span>
                                    <span className="text-[10px] text-zinc-500">{msg.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-300 break-words leading-snug group-hover:text-white transition-colors">
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl">
                <form onSubmit={sendMessage} className="relative group">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Say something..."
                        className="w-full bg-zinc-800/50 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:bg-zinc-800 transition-all border border-white/5 placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-red-600 rounded-lg text-white opacity-0 group-focus-within:opacity-100 disabled:opacity-0 hover:bg-red-500 transition-all transform scale-90 group-focus-within:scale-100"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
