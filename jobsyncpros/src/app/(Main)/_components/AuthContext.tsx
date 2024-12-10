'use server';

import { cookies } from 'next/headers';

// Ensure that the userId, accessToken, and refreshToken have defined types
export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
  cookies().set('session_userid', userId, {
    httpOnly: true,
    secure: false, // Secure flag can be set to true for production over HTTPS
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  cookies().set('access_token', accessToken, {
    httpOnly: true,
    secure: false, // Secure flag can be set to true for production over HTTPS
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  cookies().set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: false, // Secure flag can be set to true for production over HTTPS
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

export async function handleRefresh() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch('http://localhost:8000/Authuser/token/refresh/', {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();
  if (data.access) {
    cookies().set('_access_token', data.access, {
      httpOnly: true,
      secure: false, // Secure flag can be set to true for production over HTTPS
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    return data.access;
  }

  resetAuthCookies();
  return null;
}

export async function resetAuthCookies() {
  cookies().delete('session_userid');
  cookies().delete('access_token');
  cookies().delete('refresh_token');
}

export async function getAccessToken() {
  let accessToken = cookies().get('access_token')?.value;
  if (!accessToken) {
    accessToken = await handleRefresh();
  }
  return accessToken;
}

export async function getRefreshToken() {
  return cookies().get('refresh_token')?.value;
}



