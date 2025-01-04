"use client";

import { useState } from "react";
import PortfolioAgents from './_components/agents';
import InputForm from "./_components/input";

const PortfolioBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [templateCode, setTemplateCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("inputs");
  const [currentAgent, setCurrentAgent] = useState(0); // Track the current agent
  const [agents, setAgents] = useState([
    {
      name: "Content Generation Agent",
      preview: "<div>Generated Portfolio Description</div>",
    },
    {
      name: "Media Processing Agent",
      preview: "<div>Optimized media preview</div>",
    },
    {
      name: "Recommendation Agent",
      preview: "<div>Recommended Layout Preview</div>",
    },
    {
      name: "Real-Time Editing Agent",
      preview: "<div>Real-time Editing Feedback</div>",
    },
  ]);

  const handleGenerateTemplate = async () => {
    setLoading(true);
    setTemplateCode(null);

    try {
      // Generate template code
      setTemplateCode("<div>Hardcoded preview HTML code here</div>");

      // Start showing agents sequentially after generating the template
      setCurrentAgent(1); // Move to the next agent after generating the template
    } catch (error) {
      console.error("Error generating portfolio:", error);
      alert("An error occurred while generating the portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextAgent = () => {
    if (currentAgent < agents.length) {
      setCurrentAgent(currentAgent + 1); // Show the next agent
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className=" bg-gray-800 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold text-teal-400">AI Portfolio Builder</h1>

          <nav>
            <ul className="flex space-x-6">
              <li
                onClick={() => setActiveTab("inputs")}
                className={`cursor-pointer text-lg ${activeTab === "inputs" ? "text-teal-400" : "text-gray-400"} hover:text-teal-300 transition-colors duration-300`}
              >
                Inputs
              </li>
              <li
                onClick={() => setActiveTab("preview")}
                className={`cursor-pointer text-lg ${activeTab === "preview" ? "text-teal-400" : "text-gray-400"} hover:text-teal-300 transition-colors duration-300`}
              >
                Preview
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <PortfolioAgents/>

      <main className="container mx-auto px-6 py-12">
        <InputForm/>
        {activeTab === "inputs" && (
          <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-teal-400">
              🎨 Personalize Your Portfolio
            </h2>

            <button
              onClick={handleGenerateTemplate}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Portfolio"}
            </button>
          </section>
        )}

        {currentAgent === 1 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-teal-400">Step 1: {agents[0].name}</h2>
            <div
              className="mt-4 bg-gray-800 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: agents[0].preview }}
            ></div>
            <button
              onClick={handleNextAgent}
              className="mt-4 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300"
            >
              Next Agent
            </button>
          </div>
        )}

        {currentAgent === 2 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-teal-400">Step 2: {agents[1].name}</h2>
            <div
              className="mt-4 bg-gray-800 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: agents[1].preview }}
            ></div>
            <button
              onClick={handleNextAgent}
              className="mt-4 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300"
            >
              Next Agent
            </button>
          </div>
        )}

        {currentAgent === 3 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-teal-400">Step 3: {agents[2].name}</h2>
            <div
              className="mt-4 bg-gray-800 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: agents[2].preview }}
            ></div>
            <button
              onClick={handleNextAgent}
              className="mt-4 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300"
            >
              Next Agent
            </button>
          </div>
        )}

        {currentAgent === 4 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-teal-400">Step 4: {agents[3].name}</h2>
            <div
              className="mt-4 bg-gray-800 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: agents[3].preview }}
            ></div>
            <button
              onClick={handleNextAgent}
              className="mt-4 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300"
            >
              Next Agent
            </button>
          </div>
        )}

        {currentAgent === 5 && templateCode && (
          <section className="bg-gray-800 p-6 rounded-lg shadow-lg mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-teal-400">🌐 Live Preview</h2>
            <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                srcDoc={templateCode}
                sandbox="allow-scripts"
                className="w-full h-full"
              ></iframe>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default PortfolioBuilder;

