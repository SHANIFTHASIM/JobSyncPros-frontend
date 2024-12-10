"use client";

import { useState, useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { FaPlay } from "react-icons/fa";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { AiOutlineExpand, AiOutlineShrink } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OutPut from "./OutPut";

const CODEEDITOR_API = "/api/courses/codeEditor/";

const CodeEditor: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isIDEExpanded, setIsIDEExpanded] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("python");
  const [version, setVersion] = useState<string>("3.10.0");
  const [code, setCode] = useState<string>("// Write your code here...");
  const [output, setOutput] = useState<string>("");

  const editorRef = useRef<any>(null);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const toggleIDEPanel = () => setIsIDEExpanded((prev) => !prev);

  const languageOption = [
    { language: "python", version: "3.10.0", runtime: null },
    { language: "javascript", version: "18.15.0", runtime: "node" },
    { language: "java", version: "15.0.2", runtime: null },
    { language: "c++", version: "10.2.0", runtime: "gcc" },
    { language: "typescript", version: "5.0.3", runtime: "node" },
  ];

  const defaultCode: Record<string, string> = {
    python: `print(\"Hello World\")`,
    java: `// Write your Java code here\nclass Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
    javascript: `// Write your JavaScript code here\nconsole.log("Hello, World!");`,
    typescript: `// Write your TypeScript code here\nconsole.log("Hello, World!");`,
    "c++": `// Write your C++ code here\n#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}`,
  };

  useEffect(() => {
    const selected = languageOption.find((l) => l.language === language);
    setVersion(selected?.version || "latest");
    setCode(defaultCode[language] || "// Write your code here...");
  }, [language]);

  const runCode = async () => {
    try {
      const payload = {
        language,
        version,
        files: [{ name: "main.js", content: code }],
      };
      const response = await fetch(CODEEDITOR_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setOutput(result?.output || "Execution succeeded but no output.");
      } else {
        const error = await response.json();
        setOutput(error?.error || "An error occurred.");
      }
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div
      className={`transition-all duration-300 p-4 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg ${isIDEExpanded ? "w-full" : "w-full md:w-1/3"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <Select
          onValueChange={(value) => setLanguage(value)}
          defaultValue={language}
        >
          <SelectTrigger
            className={`w-[180px] ${isDarkMode ? "text-yellow-600 bg-black" : ""}`}
          >
            <SelectValue placeholder="Choose Language" />
          </SelectTrigger>
          <SelectContent
            className={`${isDarkMode ? "text-yellow-600 bg-black" : ""}`}
          >
            <SelectGroup>
              <SelectLabel>Language</SelectLabel>
              {languageOption.map((lang) => (
                <SelectItem
                  key={`${lang.language}-${lang.version}`}
                  value={lang.language}
                >
                  {`${lang.language} (${lang.version})`}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <button onClick={runCode} className="p-3 mt-2 bg-green-500 text-white rounded-md">
            <FaPlay />
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full">
            {isDarkMode ? <BsFillSunFill size={24} /> : <BsFillMoonFill size={24} />}
          </button>
          <button onClick={toggleIDEPanel} className="p-2 rounded-full">
            {isIDEExpanded ? <AiOutlineShrink size={24} /> : <AiOutlineExpand size={24} />}
          </button>
        </div>
      </div>

      <div className={`h-[70vh] rounded-md ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
        <Editor
          height="90%"
          theme={isDarkMode ? "vs-dark" : "light"}
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
      </div>
      <OutPut isDarkMode={isDarkMode} output={output} />
    </div>
  );
};

export default CodeEditor;







