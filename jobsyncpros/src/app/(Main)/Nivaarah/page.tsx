"use client";

import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

// Define interfaces for better type safety
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  id?: string;
}

interface ChatInterfaceProps {
  initialMessages?: Message[];
}

export default function ChatInterface({ initialMessages = [] }: ChatInterfaceProps): JSX.Element {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      id: crypto.randomUUID()
    };
    
    const newMessages: Message[] = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    
    // Add API call here for your AI backend
    // Simulate AI response for now
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'Hello! I am JARVIS. How can I assist you today?',
        timestamp: new Date(),
        id: crypto.randomUUID()
      };
      setMessages([...newMessages, assistantMessage]);
    }, 1000);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleListening = (): void => {
    setIsListening(!isListening);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 text-white">
        <h1 className="text-2xl font-bold">JARVIS AI Assistant</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full ${
              isListening ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {isListening ? <FaStop /> : <FaMicrophone />}
          </button>
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}