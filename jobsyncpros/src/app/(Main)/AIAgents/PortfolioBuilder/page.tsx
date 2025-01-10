"use client";

import { useState } from "react";
import ContentGeneration from "./_components/contentGeneration";
import TemplateAgent from "./_components/templateAgent";
import RecommendationAgent from "./_components/RecommendationAgent";
import CustomizerAgent from "./_components/customizerAgent";

const PortfolioBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [templateCode, setTemplateCode] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("inputs");
  const [displayedAgents, setDisplayedAgents] = useState<number[]>([0]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const agents = [
    {
      name: "Content Generation Agent",
      preview: "<div>Generated Portfolio Description</div>",
      component: <ContentGeneration />,
    },
    {
      name: "Recommendation Agent",
      preview: "<div>Recommended Layout Preview</div>",
      component: <RecommendationAgent />,
    },
    {
      name: "Template Agent",
      preview: "<div>Generate template</div>",
      component: <TemplateAgent />,
    },
    {
      name: "Customizer Agent",
      preview: "<div>Real-time Editing Feedback</div>",
      component: <CustomizerAgent />,
    },
  ];

  const handleGenerateTemplate = async () => {
    setLoading(true);
    try {
      setTemplateCode(`
        <div style='padding: 20px; font-family: Arial, sans-serif;'>
          <h1 style='color: #4CAF50;'>My Portfolio</h1>
          <p>Welcome to my personal portfolio. I specialize in creating engaging web experiences.</p>
          <h2>Projects</h2>
          <ul>
            <li>Project 1 - E-commerce Website</li>
            <li>Project 2 - Blogging Platform</li>
          </ul>
          <h2>Contact</h2>
          <p>Email: example@example.com</p>
        </div>
      `);
    } catch (error) {
      console.error("Error generating portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextAgent = () => {
    if (displayedAgents.length < agents.length) {
      setDisplayedAgents([...displayedAgents, displayedAgents.length]);
    }
  };

  const togglePreview = () => {
    if (!templateCode) {
      handleGenerateTemplate();
    }
    setPreviewVisible(!previewVisible);
  };

  const closePreview = () => {
    setPreviewVisible(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white font-sans">
      <header className="bg-gradient-to-r from-teal-500 to-blue-500 py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold text-white">AI Portfolio Builder</h1>
          <nav>
            <ul className="flex space-x-6">
              <li
                onClick={() => setActiveTab("inputs")}
                className={`cursor-pointer text-lg ${activeTab === "inputs" ? "text-white" : "text-gray-300 hover:text-white"} transition-colors duration-300`}
              >
                Inputs
              </li>
              <li
                onClick={togglePreview}
                className="cursor-pointer text-lg text-white hover:text-gray-300 transition-colors duration-300"
              >
                Preview
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {displayedAgents.map((index) => (
          <div key={index} className="mt-12">
            <h2 className="text-2xl font-semibold text-teal-400">
              Step {index + 1}: {agents[index].name}
            </h2>
            {agents[index].component}
            <div
              className="mt-4 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
              dangerouslySetInnerHTML={{ __html: agents[index].preview }}
            ></div>
            {index === displayedAgents.length - 1 && index < agents.length - 1 && (
              <button
                onClick={handleNextAgent}
                className="mt-4 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300 shadow-lg"
              >
                Next Agent
              </button>
            )}
          </div>
        ))}

        <div className={`fixed mt-28 top-0 right-0 h-[510px] w-3/4 shadow-2xl bg-transparent transform transition-transform duration-300 ${previewVisible ? 'translate-x-0' : 'translate-x-full'} shadow-lg`}>
          <div className="relative w-full h-full bg-white rounded-lg shadow-lg">
            <div className="flex flex-row gap-7 p-4">
              <button
                onClick={closePreview}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-md"
              >
                Close
              </button>
              <button
                onClick={togglePreview}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md"
              >
                Minimize
              </button>
            </div>
            <iframe
              srcDoc={templateCode}
              sandbox="allow-scripts"
              className="w-full h-full border-0 rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioBuilder;


