"use server"

import { getToken } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

// Middleware API route for sending a message
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const authToken = getToken();
    if (!authToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (req.method === 'POST') {
        const { group, content } = req.body;

        try {
            const response = await fetch(`${process.env.DJANGO_BACKEND_URL}/feature3/messages/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, // Add security token
                },
                body: JSON.stringify({ group, content }),
            });

            const data = await response.json();
            res.status(response.status).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to send message' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

