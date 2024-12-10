"use server";

import { getToken } from '@/lib/auth';  // Assume this function gets the auth token
import { NextResponse } from 'next/server';

const DJANGO_API_URL = 'http://127.0.0.1:8000/feature4/commands/';

export async function POST(request: Request) {
  const authToken = getToken();  // Get the token from your auth library
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { command_text, urls } = body;

    // Forward the request to Django API with Authorization header (Bearer token)
    const res = await fetch(DJANGO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,  // Add Bearer token for authorization
      },
      body: JSON.stringify({ command_text, urls }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error submitting command:', error);
    return NextResponse.json({ error: 'Failed to submit command' }, { status: 500 });
  }
}

// Unified GET function to handle both status and results based on command_id
export async function GET(request: Request, { params }: { params: { command_id: string } }) {
  const { command_id } = params;
  const authToken = getToken();
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let url = `${DJANGO_API_URL}${command_id}`;

    // Check if it's a status or results request
    if (request.url.includes('/status')) {
      url += '/status/';
    } else if (request.url.includes('/results')) {
      url += '/results/';
    } else {
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    // Fetch the command status or results from Django API with Authorization header
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,  // Add Bearer token here
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error fetching command data:', error);
    return NextResponse.json({ error: 'Failed to fetch command data' }, { status: 500 });
  }
}
