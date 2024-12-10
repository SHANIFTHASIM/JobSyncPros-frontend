import { deleteTokens } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function POST(request:Request) {
    
    deleteTokens()
    
    return NextResponse.json({},{status: 200})
    
}