"use server"

import { getToken } from "@/lib/auth";
import { NextResponse } from "next/server";


const DJANGO_PORTFOLIO_CONTENTGENERATION_CREATE_API = "http://127.0.0.1:8000/feature5/portfolio/content-agent/";

export async function POST(request:Request){
    const authToken = await getToken();
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  

    try {
        const formData = await request.formData()

        const res= await fetch(DJANGO_PORTFOLIO_CONTENTGENERATION_CREATE_API,{
            method:"POST",
            headers:{
                "authorization":`Bearer${authToken}`,
            },
            body:formData,
        })

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data }, { status: res.status });
          }
      
          return NextResponse.json(data, { status: 201 });

  
    } catch (error) {
        console.error("Error:",error)
        return  NextResponse.json({ error: "An error occurred while posting content for portfolio." }, { status: 500 })
        
    }

}