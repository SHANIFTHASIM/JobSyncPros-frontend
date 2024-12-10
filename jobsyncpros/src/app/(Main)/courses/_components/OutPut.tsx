"use client";

import { useState } from "react";

interface OutPutProps {
    isDarkMode: boolean;
    output: string;
  }

const OutPut: React.FC<OutPutProps>= ({ isDarkMode, output }) =>  {


  return (
    <div> 
        
      {/* Output Section */}
      <div
        className={`mt-4 p-4 rounded-md ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
        }`}
      >
        <h3 className="font-semibold">Output:</h3>
        <pre className="whitespace-pre-wrap">{output || "No output yet."}</pre>
      </div>
  
    </div>
  )
}

export default OutPut