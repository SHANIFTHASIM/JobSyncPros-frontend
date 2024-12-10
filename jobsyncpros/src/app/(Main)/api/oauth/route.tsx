"use server";

// /pages/api/oauth/discord.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken, getRefreshToken } from '@/lib/auth'; 


export async function GET(req: NextRequest) {
  const jobSyncProsToken = getToken();  // Retrieve JobSyncPros access token from cookies
  const refreshToken = getRefreshToken();  // Retrieve JobSyncPros refresh token from cookies

  // Step 1: Check if JobSyncPros tokens are available
  if (!jobSyncProsToken || !refreshToken) {
    return NextResponse.json({ error: 'No JobSyncPros tokens found in cookies' }, { status: 400 });
  }

  // Step 2: Store tokens in Django backend temporarily
  const storeResponse = await fetch('http://localhost:8000/feature3/oauth/store-token/', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jobSyncProsToken}`,
        
 },
    body: JSON.stringify({
      access_token: jobSyncProsToken,
      refresh_token: refreshToken,
      platform: 'jobsyncpros',
    }),
  });
  console.log("fetched authtoken",jobSyncProsToken);

  if (!storeResponse.ok) {
    return NextResponse.json({ error: 'Failed to store JobSyncPros tokens' }, { status: 500 });
  }

  // Step 3: Redirect user to Discord's OAuth authorization page
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}&scope=identify+email+guilds+guilds.join+connections+guilds.members.read`;

  return NextResponse.redirect(discordAuthUrl);  // Redirect to Discord for OAuth authorization
}
