"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/discord/guild', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: groupName }),
            });

            if (!response.ok) {
                throw new Error('Failed to create group');
            }

            router.push('/UserGroups');
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="h-screen bg-gray-800 flex items-center justify-center text-white">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl mb-4 font-bold">Create a Group</h1>
                <form onSubmit={handleCreateGroup}>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        className="w-full p-2 mb-4 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg transition-all"
                    >
                        Create Group
                    </button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreateGroup;



