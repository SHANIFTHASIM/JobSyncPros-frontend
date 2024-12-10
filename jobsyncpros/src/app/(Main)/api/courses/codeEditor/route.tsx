"use server";

import { NextResponse } from "next/server";

// Backend API URL
const CODEEXECUTE_BACKEND_API = "http://127.0.0.1:8000/feature4/execute-code/";
const PISTON_API_URL = "https://emkc.org/api/v2/piston"; // Piston API base URL

// POST handler for executing code
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { language, version, files } = body;

    if (!language || !version || !files || !Array.isArray(files)) {
      console.error("Invalid input. Required fields are missing or malformed.");
      return NextResponse.json(
        { error: "Invalid input. Language, version, and files are required." },
        { status: 400 }
      );
    }

    const payload = { language, version, files };

    const response = await fetch(CODEEXECUTE_BACKEND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Backend responded with error:", errorResponse); // Debug backend error
      return NextResponse.json(
        { error: "Failed to execute code with the Piston API.", details: errorResponse },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      output: result?.run?.stdout || result?.run?.stderr|| "execution completed but no output",
      error: result?.run?.stderr || null,
    });
  } catch (error) {
    console.error("Internal Server Error:", error); // Debug unexpected errors
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}




// // Fetch supported languages
// export async function GET() {
//     try {
//         const response = await fetch(`${PISTON_API_URL}/runtimes`);
        
//         // Log the response status and URL for debugging
//         console.log("Fetching languages from:", `${PISTON_API_URL}/runtimes`);
//         console.log("Response status:", response.status);

//         if (!response.ok) {
//             const errorBody = await response.text(); // Log any response body for errors
//             console.error("Failed to fetch languages:", errorBody);
//             return new Response(
//                 JSON.stringify({ error: "Failed to fetch languages." }),
//                 { status: response.status }
//             );
//         }

//         const data = await response.json();
//         const languages = data.map((lang: { language: string, version: string }) => ({
//             language: lang.language,
//             version: lang.version
//         }));
//         return new Response(JSON.stringify({ languages }), {
//             status: 200,
//             headers: { "Content-Type": "application/json" }
//         });
        
//     } catch (error) {
//         console.error("Error fetching languages:", error);
//         return new Response(
//             JSON.stringify({ error: "Internal Server Error." }),
//             { status: 500, headers: { "Content-Type": "application/json" } }
//         );
//     }
// }



