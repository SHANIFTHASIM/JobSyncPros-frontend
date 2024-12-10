"use server"

import { getToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // Log the start of the request
        console.log("Starting fetch to Discord user API");

        const authToken = getToken();

        if (!authToken) {
            console.error("Access token not found");
            return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
        }

        console.log("Access token retrieved:", authToken);

        // Fetch the Discord user info from your Django backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feature3/discord/user/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}` // Pass the access token in the header
            }
        });

        const data = await response.json();

        console.log("Response from Django backend:", response.status, data);

        if (!response.ok) {
            console.error("Error response from backend:", response.status, data);
            return NextResponse.json(data, { status: response.status });
        }

        // Successfully retrieved user info
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error during fetch:", error);
        return NextResponse.json({ error: 'Failed to fetch Discord user info' }, { status: 500 });
    }
}

