"use client"


import { useState } from 'react';

const JoinServer: React.FC = () => {
    const [serverId, setServerId] = useState<string>('');
    const [inviteUrl, setInviteUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleJoinServer = async () => {
        setError(''); // Clear previous error
    
        console.log('Attempting to join server with ID:', serverId); // Debugging line
    
        try {
            const response = await fetch('/api/discord/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serverId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'An error occurred while trying to join the server.');
                return;
            }

            const data = await response.json();
            setInviteUrl(data.invite_url); // Set the invite URL from the response
        } catch (error) {
            setError('An error occurred while trying to join the server.');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Join a Discord Server</h2>
            <input
                type="text"
                placeholder="Enter Server ID"
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
            />
            <button onClick={handleJoinServer}>Join Server</button>

            {inviteUrl && (
                <p>
                    Invite link: <a href={inviteUrl} target="_blank" rel="noopener noreferrer">{inviteUrl}</a>
                </p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default JoinServer;


