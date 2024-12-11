"use client";

import React from 'react';
import Image from 'next/image';
import { FaHeart, FaRegComment, FaBookmark } from 'react-icons/fa';
import useSWR from 'swr';
import parse from 'html-react-parser';


type Post = {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
};

// const fetcher=(url: string)=>fetch(url).then((res)=>res.json());
const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  console.log("response data :", data);
  return data?.data || [];// Ensure data is an array
};


export default function HomeFeed() {
  const { data: rawPosts, error } = useSWR<Post[]>('/api/posts', fetcher);

  if (error) {
    return <div>Error loading posts.</div>;
  }

  if (!rawPosts) {
    return <div>Loading posts...</div>;
  }


  const posts: Post[] = rawPosts.map((post: any) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    image: post.image,
    author: post.user.username, // Extracting username from the user object
  }));

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-xl font-bold text-gray-800 text-center">
          Home Feed
        </h1>
      </header>

      <main className="container mt-3 mx-auto px-6 md:px-16 max-w-screen-md">
        <div className="space-y-6">
          {posts?.map((post: Post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover"
                width={600}
                height={300}
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {post.title}
                </h2>
                <div className="text-sm text-gray-600 mt-2">{parse (post.content) }</div>
                <span className="text-sm text-gray-500 block mt-2">
                  By {post.author}
                </span>
                <div className="flex items-center justify-around mt-4">
                  {/* Like Button */}
                  <button className="flex items-center text-red-500">
                    <FaHeart className="mr-1" />
                    <span>Like</span>
                  </button>

                  {/* Comment Button */}
                  <button className="flex items-center text-blue-500">
                    <FaRegComment className="mr-1" />
                    <span>Comment</span>
                  </button>

                  {/* Save Button */}
                  <button className="flex items-center text-gray-700">
                    <FaBookmark className="mr-1" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

