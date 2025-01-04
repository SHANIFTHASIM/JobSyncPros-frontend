import React, { useState } from "react";

interface Agent {
  id: number;
  name: string;
  description: string;
  preview: string;
  active: boolean;
}

const PortfolioAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 1,
      name: "Content Generation Agent",
      description: "Generates polished text for projects like blogs, articles, or portfolio descriptions.",
      preview: `
        <div style="padding: 10px; background-color: #f9fafb; border-radius: 8px;">
          <h3 style="color: #2563eb;">Generated Portfolio Description</h3>
          <p>
            Hello, I'm a passionate freelancer with years of experience building engaging web content.
            My expertise includes writing technical blogs, e-commerce product descriptions, and more!
          </p>
        </div>
      `,
      active: false,
    },
    {
      id: 2,
      name: "Media Processing Agent",
      description: "Optimizes and integrates media like images, videos, and logos into your portfolio.",
      preview: `
        <div style="padding: 10px; background-color: #f9fafb; border-radius: 8px;">
          <h3 style="color: #2563eb;">Media Processing Demo</h3>
          <img src="https://via.placeholder.com/600x300" alt="Processed Image" style="border-radius: 8px; max-width: 100%;" />
          <p>Image has been optimized for better performance and integrated into the portfolio.</p>
        </div>
      `,
      active: true,
    },
    {
      id: 3,
      name: "Recommendation Agent",
      description: "Suggests templates and layouts based on your preferences and style.",
      preview: `
        <div style="padding: 10px; background-color: #f9fafb; border-radius: 8px;">
          <h3 style="color: #2563eb;">Recommended Layout</h3>
          <p>Based on your input, we recommend using a modern layout with bold typography and large images for a stunning effect!</p>
          <img src="https://via.placeholder.com/800x400" alt="Recommended Template" style="border-radius: 8px; max-width: 100%;" />
        </div>
      `,
      active: false,
    },
    {
      id: 4,
      name: "Real-Time Editing Agent",
      description: "Provides live feedback and makes instant changes to your portfolio layout during editing.",
      preview: `
        <div style="padding: 10px; background-color: #f9fafb; border-radius: 8px;">
          <h3 style="color: #2563eb;">Real-Time Editing Feedback</h3>
          <p>Your changes are being applied in real time! Here is how your updated section looks:</p>
          <p><strong>Updated Bio Section:</strong> "Hi, I am an innovative web developer with a focus on interactive web experiences."</p>
        </div>
      `,
      active: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleAgentStatus = (id: number) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.id === id ? { ...agent, active: !agent.active } : agent
      )
    );
  };

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-teal-400">AI Portfolio Agents</h1>

      <input
        type="text"
        placeholder="Search agents..."
        className="w-full p-3 mb-6 rounded-lg shadow-sm text-gray-900 border border-gray-300 focus:ring-2 focus:ring-teal-400"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className={`p-6 border rounded-lg shadow-lg bg-gray-800 hover:shadow-xl transition-all duration-300 ${agent.active ? 'border-teal-400' : 'border-gray-600'}`}
          >
            <h2 className="text-xl font-bold text-teal-400 mb-2">{agent.name}</h2>
            <p className="text-gray-300 mb-4">{agent.description}</p>

            <div
              className="preview border rounded-lg overflow-hidden mb-4"
              dangerouslySetInnerHTML={{ __html: agent.preview }}
            ></div>

            <button
              onClick={() => toggleAgentStatus(agent.id)}
              className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-300 ${agent.active ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'}`}
            >
              {agent.active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioAgents;



