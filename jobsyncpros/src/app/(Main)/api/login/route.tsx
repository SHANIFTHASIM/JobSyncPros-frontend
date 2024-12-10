"use server";

import {  setRefreshToken, setToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
// import { getToken,getRefreshToken } from '../../../../lib/auth';

const DJANGO_LOGIN_API="http://127.0.0.1:8000/Authuser/login/"



export  async function POST(request: Request) {
  

    const requestData = await request.json() //right after the data get from client 
    const res = await fetch(DJANGO_LOGIN_API, {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify(requestData),
     credentials: "include",
    });
    const data= await res.json()
     if(res.ok){
       const {access_token,refresh_token}=data
  
       setToken(access_token)
       setRefreshToken(refresh_token)
       return NextResponse.json({"loggedIn": true}, {status: 200})
     }
    
     return NextResponse.json({"loggedIn": false,...data}, {status: 400})
    
  }
  


