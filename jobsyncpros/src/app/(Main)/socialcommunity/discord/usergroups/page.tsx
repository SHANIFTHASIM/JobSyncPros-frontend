"use client"

import { useEffect, useState } from 'react';

const UserGroups = () => {
    const [groups, setGroups] = useState<any[]>([]);

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await fetch('/api/discord/guild');
            const data = await response.json();
            setGroups(data);
        };
        fetchGroups();
    }, []);

    return (
        <div className="h-screen bg-gray-800 flex items-center justify-center text-white">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl mb-4 font-bold">Your Groups</h1>
                <ul className="space-y-2">
                    {groups.map((group) => (
                        <li
                            key={group.id}
                            className="bg-gray-900 p-3 rounded-lg hover:bg-gray-800 transition-all"
                        >
                            {group.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserGroups;

