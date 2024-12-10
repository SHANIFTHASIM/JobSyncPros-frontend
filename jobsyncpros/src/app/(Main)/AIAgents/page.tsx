"use client"

import { useState } from 'react';

type CommandStatus = {
  status: string;
  command_id: number;
};

type TaskResult = {
  agent_name: string;
  result_data: string;
};

export default function Home() {
  const [commandText, setCommandText] = useState<string>('');
  const [urls, setUrls] = useState<string>('');
  const [commandStatus, setCommandStatus] = useState<CommandStatus | null>(null);
  const [taskResults, setTaskResults] = useState<TaskResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle command submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command_text: commandText,
          urls: urls.split(',').map((url) => url.trim()),
        }),
      });

      const data = await response.json();
      setCommandStatus({ status: data.status, command_id: data.command_id });
      setLoading(false);
    } catch (error) {
      console.error('Error submitting command:', error);
      setLoading(false);
    }
  };

  // Polling for command status and results
  const fetchCommandResults = async () => {
    if (!commandStatus) return;

    try {
      const statusResponse = await fetch(`/api/agents/${commandStatus.command_id}/status`);
      const statusData = await statusResponse.json();
      setCommandStatus((prev) => (prev ? { ...prev, status: statusData.status } : { status: statusData.status, command_id: commandStatus.command_id }));

      const resultResponse = await fetch(`/api/agents/${commandStatus.command_id}/results`);
      const resultData = await resultResponse.json();
      setTaskResults(resultData.results);
    } catch (error) {
      console.error('Error fetching command results:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Content Scraper and Summarizer</h1>

        {/* Command Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Command:</label>
          <input
            type="text"
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            placeholder="Enter your command"
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* URLs Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700">URLs (comma-separated):</label>
          <input
            type="text"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="Enter URLs"
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 font-semibold rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {loading ? 'Processing...' : 'Submit Command'}
        </button>

        {/* Command Status */}
        {commandStatus && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="font-semibold text-gray-700">
              Command Status: <span className="text-blue-600">{commandStatus.status}</span>
            </h3>
            {commandStatus.status !== 'completed' && (
              <button
                onClick={fetchCommandResults}
                disabled={loading}
                className="mt-4 w-full py-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
              >
                {loading ? 'Checking Status...' : 'Check Status'}
              </button>
            )}
          </div>
        )}

        {/* Task Results */}
        {taskResults.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-700">Task Results:</h3>
            <ul className="mt-4 space-y-4">
              {taskResults.map((result, index) => (
                <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                  <strong className="text-gray-800">{result.agent_name}:</strong> <span className="text-gray-600">{result.result_data}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

