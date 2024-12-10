"use server";

import { NextRequest, NextResponse } from 'next/server';
import { setToken, setRefreshToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');  // Get the authorization code from Discord OAuth

  // Step 1: Check if the authorization code exists
  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided by Discord' }, { status: 400 });
  }

  try {
    // Step 2: Exchange the authorization code for Discord access and refresh tokens
    const discordTokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,  // Discord authorization code
        redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
      }),
    });

    const discordTokenData = await discordTokenResponse.json();

    // Step 3: Retrieve JobSyncPros tokens from the Django backend
    const retrieveResponse = await fetch('http://localhost:8000/feature3/oauth/retrieve-token/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${discordTokenData.access_token}`,  // Pass the Discord access token for authorization
      },
    });

    const tokenData = await retrieveResponse.json();
    console.log("Retrieved tokens:", tokenData);
    
    if (retrieveResponse.ok) {
      // Step 4: Restore JobSyncPros tokens to HttpOnly cookies
      setToken(tokenData.access_token);  // Set JobSyncPros access token back into cookies
      setRefreshToken(tokenData.refresh_token);  // Set JobSyncPros refresh token back into cookies
    
     // Step 5: Call the OAuthCallbackView to store tokens in Django backend
    const callbackResponse = await fetch('http://localhost:8000/feature3/oauth/callback/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`, 
      },
      body: JSON.stringify({
        access_token: discordTokenData.access_token,
        refresh_token: discordTokenData.refresh_token,
        expires_in: discordTokenData.expires_in,
        platform: 'discord',  // Specify the platform as Discord
      }),
    });

    const callbackData = await callbackResponse.json();

    if (!callbackResponse.ok) {
      return NextResponse.json({ error: 'Failed to store tokens in Django backend', details: callbackData }, { status: 500 });
    }

    // Step 6: Clean up old tokens from Django backend
      // Step 6: Clean up the temporary JobSyncPros tokens from Django backend
      console.log("Token Data for deletion:", tokenData); // Log token data for deletion
      const deleteResponse = await fetch('http://localhost:8000/feature3/oauth/delete-token/', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${tokenData.access_token}`,  // Pass the JobSyncPros access token
        },
      });
    
      const deleteResponseData = await deleteResponse.json();
      if (!deleteResponse.ok) {
        console.error('Failed to delete JobSyncPros tokens', deleteResponseData);
      }
    
      // Step 7: Redirect the user back to the dashboard or appropriate page
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Use your base URL
      return NextResponse.redirect(`${baseUrl}/socialcommunity/user`);  // Redirect user back to the dashboard or another page
    } else {
      return NextResponse.json({ error: 'Failed to retrieve JobSyncPros tokens' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error during OAuth flow:', error);
    return NextResponse.json({ error: 'Error during OAuth flow' }, { status: 500 });
  }
}

