"use client"

import { useEffect } from 'react';

const GoogleAuth: React.FC = () => {
  useEffect(() => {
    const googleAuthUrl = 'http://localhost:3000/auth/google/callback/'
    
    // Redirect to Google's OAuth endpoint
    window.location.href = googleAuthUrl;
  }, []);

  return <div>Redirecting to Google...</div>;
};

export default GoogleAuth;