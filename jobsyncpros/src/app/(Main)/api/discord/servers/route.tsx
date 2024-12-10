"use server"

import { getToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const authToken = getToken();
    console.log("Frontend Access Token:", authToken);  // Log to confirm token presence

    if (!authToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feature3/servers/list/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            }
        });

        const data = await response.json();
        if (response.ok) {
            return NextResponse.json(data, { status: 200 });
        } else {
            return NextResponse.json({ error: data.error || 'Failed to fetch guilds' }, { status: response.status });
        }
    } catch (error) {
        console.error("Error in fetching joined servers:", error);  // Log any errors that occur
        return NextResponse.json({ error: 'Failed to fetch joined servers' }, { status: 500 });
    }
}


