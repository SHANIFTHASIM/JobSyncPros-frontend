"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SendMessage = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await fetch('/api/discord/guilds/');
            const data = await response.json();
            setGroups(data);
        };
        fetchGroups();
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/discord/messages/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ group: selectedGroup, content: message }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setMessage('');
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="h-screen bg-gray-800 flex items-center justify-center text-white">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl mb-4 font-bold">Send a Message</h1>
                <form onSubmit={handleSendMessage}>
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="w-full p-2 mb-4 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                    >
                        <option value="">Select a group</option>
                        {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message"
                        className="w-full p-2 mb-4 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg transition-all"
                    >
                        Send Message
                    </button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default SendMessage;

