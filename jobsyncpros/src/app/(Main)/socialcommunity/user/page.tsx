"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaDiscord } from 'react-icons/fa';


// Define a type for the Discord user info
interface DiscordUserInfo {
    discord_id: string;
    username: string;
    email: string;
}

const DiscordUserPage = () => {
    const [userInfo, setUserInfo] = useState<DiscordUserInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/api/discord/user');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch user info');
                }
                setUserInfo(data);
            } catch (err) {
                // Since 'err' is of type 'unknown', we need to assert it as Error
                setError((err as Error).message);
            }
        };

        fetchUserInfo();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className=' bg-blue-700'>
            <h1>Discord User Info<FaDiscord /></h1>
            <p>Username: {userInfo.username}</p>
            <p>Email: {userInfo.email}</p>
            <p>Discord ID: {userInfo.discord_id}</p>
        </div>
    );
};

export default DiscordUserPage;
