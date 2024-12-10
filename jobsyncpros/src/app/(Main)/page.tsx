import React from 'react';
import Image from 'next/image';
import { FaHeart, FaRegComment, FaBookmark } from 'react-icons/fa';

export default function HomeFeed() {
  // Hardcoded posts data
  const posts = [
    {
      id: 1,
      title: 'Post 1',
      content: 'This is the content for Post 1.',
      image: '/jsplogo.jpg', // Assume you have images in the public/images folder
      author: 'John Doe',
    },
    {
      id: 2,
      title: 'Post 2',
      content: 'This is the content for Post 2.',
      image: '/slack.png',
      author: 'Jane Smith',
    },
    {
      id: 3,
      title: 'Post 3',
      content: 'This is the content for Post 3.',
      image: '/discord.png',
      author: 'Alice Johnson',
    },
    {
      id: 4,
      title: 'Post 4',
      content: 'This is the content for Post 4.',
      image: '/jsplogo.jpg',
      author: 'Alice Johnson',
    },
    {
      id: 5,
      title: 'Post 5',
      content: 'This is the content for Post 5.',
      image: '/slack.png',
      author: 'Alice Johnson',
    },
    {
      id: 6,
      title: 'Post 6',
      content: 'This is the content for Post 6.',
      image: '/discord.png',
      author: 'Alice Johnson',
    },
    {
      id: 7,
      title: 'Post 7',
      content: 'This is the content for Post 7.',
      image: '/jsplogo.jpg',
      author: 'Alice Johnson',
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-xl font-bold text-gray-800 text-center">
          Home Feed
        </h1>
      </header>

      <main className="container mx-auto px-6 md:px-16 max-w-screen-md">
        <div className="space-y-6">
          {posts.map((post) => (
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
                <p className="text-sm text-gray-600 mt-2">{post.content}</p>
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

