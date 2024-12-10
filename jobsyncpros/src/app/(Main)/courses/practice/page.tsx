"use client";

import { useState } from "react";
import { AiOutlineExpand, AiOutlineShrink } from "react-icons/ai";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem,SelectLabel,SelectGroup, SelectTrigger, SelectValue } from '@/components/ui/select';
import CodePreview from "../_components/PracticeCode";
import CodeEditor from "../_components/CodeEditor";
import OutPut from "../_components/OutPut";

const PracticePage = () => {
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [isIDEExpanded, setIsIDEExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [code, setCode] = useState(`console.log("Hello, World!");`);

  const toggleCodePanel = () => setIsCodeExpanded(!isCodeExpanded);
  const toggleIDEPanel = () => setIsIDEExpanded(!isIDEExpanded);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const runCode = () => {
    try {
      // Execute the user's code and log the output in the console
      console.log(eval(code)); // NOTE: Using eval is not recommended for production, only for testing purposes here.
    } catch (error) {
      console.error("Error in code:", error);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Left side: Sample Code Section */}
      <CodePreview/>
      <div
        className={`transition-all duration-300 p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg ${
          isCodeExpanded ? "w-full md:w-2/3" : "w-full md:w-1/3"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
            Practice Code
          </h2>
          <button
            onClick={toggleCodePanel}
            className={`p-2 ${isDarkMode ? "text-blue-400 hover:bg-blue-600" : "text-blue-600 hover:bg-blue-100"} rounded-full`}
            aria-label="Toggle Code Panel"
          >
            {isCodeExpanded ? <AiOutlineShrink size={24} /> : <AiOutlineExpand size={24} />}
          </button>
        </div>
        <div className={`${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"} overflow-y-auto max-h-[70vh] p-2 rounded-md`}>
          <pre className="text-sm">
            {`// Sample JavaScript code
function greet() {
  console.log("Hello, World!");
}

greet();`}
          </pre>
        </div>
      </div>

      {/* Right side: Code Editor IDE Section */}
      <CodeEditor/>
      
      
      
      
    </div>
  );
};

export default PracticePage;
