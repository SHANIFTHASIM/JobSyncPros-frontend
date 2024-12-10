"use client";

import { Button } from '@/components/ui/button';
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface ParsedResult {
  resume_text: string;
  recommendations: string;
}

interface ChatMessage {
  user: string;
  bot: string;
}

const ResumeChatPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Handle File Change for Resume Upload
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // Handle Resume Upload Submit
  const handleUploadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      alert('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/feature1/upload/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data: ParsedResult = await response.json();
        setResult(data);
      } else {
        alert('Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Chat Message Submission
  const handleChatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userMessage.trim() === '') return;

    const newChatMessages = [...chatMessages, { user: userMessage, bot: '...' }];
    setChatMessages(newChatMessages);

    try {
      const response = await fetch('http://localhost:8000/feature1/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse = data.botMessage || "No response";
        setChatMessages([...newChatMessages, { user: userMessage, bot: botResponse }]);
      } else {
        alert('Failed to get response from AI');
      }
    } catch (error) {
      console.error('Error in chat interaction:', error);
    }

    setUserMessage('');  // Clear the input field after sending the message
  };

  return (
    <div className="max-w-4xl mx-2  my-2 p-8 bg-white shadow-xl shadow-slate-900 rounded-lg mt-12 border-slate-500">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Resume Analyzer & AI Chat</h1>

      {/* Resume Upload Section */}
      <form onSubmit={handleUploadSubmit} className="space-y-6">
        <div>
          <label className="block text-lg text-gray-700 font-semibold mb-3">Upload Your Resume</label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition ease-in-out duration-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {/* Display Resume Text & Recommendations */}
      {result && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resume Preview</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap">{result.resume_text}</pre>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">AI Recommendations</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap">{result.recommendations}</pre>
        </div>
      )}

      {/* Chat with AI Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Chat with AI</h2>

        {/* Chat Box */}
        <div className="border border-gray-300 rounded-lg p-6 h-72 overflow-y-scroll bg-gray-100">
          {chatMessages.map((message, index) => (
            <div key={index} className="mb-6">
              <div className="text-blue-700 font-bold">User:</div>
              <p className="text-gray-800">{message.user}</p>
              <div className="text-green-700 font-bold mt-2">AI:</div>
              <p className="text-gray-800">{message.bot}</p>
            </div>
          ))}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleChatSubmit} className="flex mt-6 space-x-4">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
            placeholder="Ask AI a question..."
          />
          <Button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
          >
            Send
          </Button>
          
        </form>
      </div>

    </div>
  );
};

export default ResumeChatPage;