'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, User } from 'lucide-react';

interface Message {
    user: string;
    text: string;
    timestamp: string;
}

interface PartyChatProps {
    roomId: string;
    username?: string;
}

export default function PartyChat({ roomId, username = 'Guest' }: PartyChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [users, setUsers] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showUsers, setShowUsers] = useState(false);

    useEffect(() => {
        // 1. Channel setup for Chat (Broadcast) AND Presence
        const channel = supabase.channel(`room:${roomId}`, {
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
                // Simple dedupe if needed, but presence keys should be unique if we set them so.
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
    }, [roomId, username]);

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
        };

        // Broadcast
        await supabase.channel(`room:${roomId}`).send({
            type: 'broadcast',
            event: 'CHAT',
            payload: newMessage,
        });

        // We rely on "self: true" so we don't need local update double.
        setInputText('');
    };

    return (
        <div className="flex flex-col h-full bg-[#0f0f0f] border-l border-[#222]">
            {/* Header */}
            <div className="p-3 border-b border-[#222] flex justify-between items-center bg-[#1a1a1a]">
                <h3 className="font-bold text-gray-200 flex items-center gap-2 text-sm">
                    Live Chat
                </h3>
                <button
                    onClick={() => setShowUsers(!showUsers)}
                    className="text-xs bg-[#333] px-2 py-1 rounded text-gray-300 flex items-center gap-1 hover:bg-[#444]"
                >
                    <User size={12} /> {users.length} Watching
                </button>
            </div>

            {/* Users List Overlay */}
            {showUsers && (
                <div className="bg-[#1a1a1a] p-2 border-b border-[#222] max-h-32 overflow-y-auto">
                    <p className="text-xs text-gray-500 mb-2 font-bold">IN THIS ROOM:</p>
                    {users.map((u, i) => (
                        <div key={i} className="text-xs text-gray-300 flex items-center gap-2 py-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div> {u}
                        </div>
                    ))}
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
                        <span className="text-2xl">👋</span>
                        <p className="text-xs">Say hello!</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-baseline gap-2">
                            <span className={`text-xs font-bold ${msg.user === username ? 'text-red-500' : 'text-gray-400'}`}>
                                {msg.user}
                            </span>
                            <span className="text-[10px] text-gray-600">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-200 mt-0.5 break-words leading-tight">
                            {msg.text}
                        </p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-3 border-t border-[#222] bg-[#1a1a1a]">
                <div className="relative">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Chat..."
                        className="w-full bg-[#0a0a0a] text-gray-200 text-sm rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-red-900 border border-[#333]"
                    />
                    <button
                        type="submit"
                        className="absolute right-1.5 top-1.5 p-1.5 bg-transparent text-gray-400 hover:text-white transition"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}
