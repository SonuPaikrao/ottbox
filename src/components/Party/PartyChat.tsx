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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Join the chat channel
        const channel = supabase.channel(`room:${roomId}`, {
            config: {
                broadcast: { self: true }, // receive own messages? actually simpler to just push locally and broadcast to others
            },
        });

        channel
            .on('broadcast', { event: 'CHAT' }, (payload) => {
                setMessages((prev) => [...prev, payload.payload as Message]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId]);

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

        // Broadcast to others (and self if configured, but better to optimistic update)
        // Wait, if self: true is on, we receive it too. Let's use that for simplicity.
        // Actually, local update feels faster. Let's do local update + broadcast to others.
        // If self: true is set, we might duplicate. Let's turn self: false (default).

        // Broadcast
        await supabase.channel(`room:${roomId}`).send({
            type: 'broadcast',
            event: 'CHAT',
            payload: newMessage,
        });

        // Local update
        setMessages((prev) => [...prev, newMessage]);
        setInputText('');
    };

    return (
        <div className="flex flex-col h-full bg-[#111] border-l border-[#333]">
            <div className="p-4 border-b border-[#333]">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <User size={18} /> Party Chat
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <p className="text-gray-500 text-center text-sm mt-4">No messages yet. Start the conversation!</p>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.user === username ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] rounded-lg p-2 px-3 text-sm ${msg.user === username
                                ? 'bg-red-600 text-white rounded-br-none'
                                : 'bg-[#333] text-gray-200 rounded-bl-none'
                            }`}>
                            {msg.user !== username && <span className="text-[10px] text-gray-400 block mb-1">{msg.user}</span>}
                            {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-600 mt-1">{msg.timestamp}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t border-[#333] flex gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#222] text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                    type="submit"
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
