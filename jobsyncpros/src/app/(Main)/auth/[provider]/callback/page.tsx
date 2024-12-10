'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const OAuthCallback: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code'); // Extract the code from URL params

  useEffect(() => {
    if (code) {
      console.log("OAuth Code:", code);

      // Call the Django backend to exchange the code for tokens
      fetch(`http://127.0.0.1:8000/Authuser/auth/google/callback/?code=${code}`, {
        method: 'GET',
        credentials: 'include',  // For handling cookies if necessary
      })
        .then((res) => {
          console.log("API Response:", res);
          if (res.ok) {
            router.push('/');  // Redirect to home on success
          } else {
            console.error("OAuth login failed:", res);
            alert('OAuth login failed');
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert('OAuth login failed: ' + error.message);
        });
    }
  }, [code, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Logging in...</p>
    </div>
  );
};

export default OAuthCallback;
