"use server"



import { NextResponse } from "next/server";
import { getToken } from '@/lib/auth';

const DJANGO_PROFILE_FETCH_API = 'http://127.0.0.1:8000/Authuser/profile/';
const DJANGO_PROFILE_UPDATE_API = 'http://127.0.0.1:8000/Authuser/profile/detail/';


// Handle GET, POST, PUT requests
export async function GET(request: Request) {
    const authToken = await getToken();
    if (!authToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(DJANGO_PROFILE_FETCH_API, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
        credentials: "include",
    });

    const data = await res.json();
    console.log("response data :", data);

    if (!res.ok) {
        return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ data }, { status: 200 });
}


// Handle profile creation
export async function POST(request: Request) {
    const authToken = getToken();
    if (!authToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const res = await fetch(DJANGO_PROFILE_FETCH_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
        credentials: "include",
    });

    const data = await res.json();
    console.log("response data :", data);

    if (!res.ok) {
        return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ ...data }, { status: 201 });
}

// Handle profile update
export async function PUT(request: Request) {
    const authToken = getToken();
    if (!authToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const body: Record<string, any> = {};  // Explicitly define body type

        // Convert FormData to a plain object
        formData.forEach((value, key) => {
            body[key] = value;
        });

        // Convert body object to URLSearchParams for x-www-form-urlencoded
        const urlEncodedBody = new URLSearchParams(body).toString();

        const res = await fetch(DJANGO_PROFILE_UPDATE_API, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/x-www-form-urlencoded", // Change to x-www-form-urlencoded
            },
            body: urlEncodedBody, // Use urlEncodedBody here
            credentials: "include",
        });

        const responseText = await res.text(); // Read the raw response as text

        const contentType = res.headers.get("Content-Type");
        
        if (contentType && contentType.includes("application/json")) {
            try {
                const data = JSON.parse(responseText);
                
                if (!res.ok) {
                    return NextResponse.json({ error: data }, { status: res.status });
                }
                
                return NextResponse.json(data, { status: 200 });
            } catch (parseError) {
                return NextResponse.json({ error: "Invalid JSON response" }, { status: 500 });
            }
        } else {
            // Handle non-JSON responses
            return NextResponse.json({ error: "Unexpected response format" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

  
