"use server"

import { getToken } from '@/lib/auth';


// Note: Next.js App Router uses a new syntax for API routes
export async function POST(req: Request) {
    const authToken = getToken(); // Get the authentication token
    if (!authToken) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { serverId } = await req.json();

    if (!serverId) {
        return new Response(JSON.stringify({ error: "Server ID is required" }), { status: 400 });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feature3/servers/${serverId}/join/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Use the fetched auth token
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return new Response(JSON.stringify({ error: errorData.error }), { status: response.status });
        }

        const inviteData = await response.json();
        return new Response(JSON.stringify({ invite_url: inviteData.invite_url }), { status: 200 });
    } catch (error) {
        console.error('Error communicating with Django server:', error);
        return new Response(JSON.stringify({ error: 'Failed to communicate with Django server' }), { status: 500 });
    }
}
