"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

interface LinkAccountPageProps {
    platformName: string;
}

const EntreprenaurPage: React.FC<LinkAccountPageProps> = ({ platformName }) => {
    const [accountId, setAccountId] = useState<string>('');

    const handleLinkAccount = async () => {
        try {
            const response = await fetch(`/accounts/link_account/${platformName}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    platform_account_id: accountId,
                }),
            });

            if (!response.ok) {
                throw new Error('Error linking account');
            }

            alert('Account linked successfully!');
        }  catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('An unknown error occurred');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Entreprenaur</h1>
                <input
                    type="text"
                    value={accountId}
                    onChange={e => setAccountId(e.target.value)}
                    placeholder={`Enter your ${platformName} idea`}
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                />
                <button
                    onClick={handleLinkAccount}
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                >
                    Post
                </button>

                <div className='mt-5 flex gap-3'>
                <Button><Link href='/createpost'>Create Posts</Link></Button>

                <Button><Link href='/posts'>View Posts</Link></Button>
                </div>
                
            </div>
        </div>
    );
};

export default EntreprenaurPage;
