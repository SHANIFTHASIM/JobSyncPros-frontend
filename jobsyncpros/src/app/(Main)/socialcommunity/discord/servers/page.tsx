"use client"


import { useEffect, useState } from 'react';

// Define the type for a server
interface Server {
    id: number;
    name: string;
}

export default function JoinedServers() {
    const [servers, setServers] = useState<Server[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchJoinedServers() {
            try {
                const response = await fetch('/api/discord/servers');

                // Check if response is OK before parsing
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to fetch joined servers');
                    return; // Exit early if the response is not OK
                }

                const data = await response.json();
                setServers(data);
            } catch (error) {
                setError('Failed to fetch joined servers');
            }
        }

        fetchJoinedServers();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Joined Servers</h1>
            {servers.length > 0 ? (
                <ul>
                    {servers.map((server) => (
                        <li key={server.id}>{server.name}</li>
                    ))}
                </ul>
            ) : (
                <p>You haven't joined any servers yet.</p>
            )}
        </div>
    );
}

