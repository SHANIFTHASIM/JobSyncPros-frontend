"use server";

import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";

const DJANGO_POST_CREATE_API = "http://127.0.0.1:8000/feature3/posts/create/";

export async function POST(request: Request) {
  const authToken = await getToken();
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Step 2: Extract form data from the request
    const formData = await request.formData(); 


    // Step 3: Forward the form data to the Django backend API
    const res = await fetch(DJANGO_POST_CREATE_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        
      },
      body: formData, // Send form data as is
    });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the post." },
      { status: 500 }
    );
  }
}

