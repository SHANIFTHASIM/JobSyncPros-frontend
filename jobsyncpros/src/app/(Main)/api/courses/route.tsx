import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_BASE_URL = "http://127.0.0.1:8000/feature4";

export async function GET(req: NextRequest): Promise<NextResponse> {
  console.log("Received request:", req.nextUrl.toString());

  const { pathname, searchParams } = req.nextUrl;
  const pathParts = pathname.split("/").filter(Boolean);
  console.log("Path parts:", pathParts);

  const action = pathParts[2];
  const repoName = pathParts[3];

  try {
    if (action === "repos" && !repoName) {
      // Fetch all repositories
      const url = `${DJANGO_API_BASE_URL}/github/repos/`;
      console.log(`Fetching repositories from Django: ${url}`);
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch repositories");
      }

      const data = await response.json();
      console.log("Repositories fetched:", data);
      return NextResponse.json(data);
    }

    if (action === "repos" && repoName && pathname.endsWith("/files")) {
      // Fetch files for a specific repository
      const url = `${DJANGO_API_BASE_URL}/github/repos/${encodeURIComponent(repoName)}/files/`;
      console.log(`Fetching files from Django: ${url}`);
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch files");
      }

      const data = await response.json();
      console.log(`Files fetched for ${repoName}:`, data);
      return NextResponse.json(data);
    }

    if (action === "repos" && repoName && pathname.endsWith("/file")) {
      // Download a specific file
      const filePath = searchParams.get("file_path");
      if (!filePath) {
        console.error("file_path query parameter is missing");
        return NextResponse.json(
          { error: "file_path query parameter is required" },
          { status: 400 }
        );
      }

      const url = `${DJANGO_API_BASE_URL}/github/repos/${encodeURIComponent(
        repoName
      )}/file?file_path=${encodeURIComponent(filePath)}`;
      console.log(`Downloading file from Django: ${url}`);
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download file");
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log(`File downloaded successfully: ${filePath}`);

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${
            filePath.split("/").pop() || "downloaded_file"
          }"`,
        },
      });
    }

    console.warn("Invalid route or parameters:", { action, repoName });
    return NextResponse.json({ error: "Invalid route or parameters" }, { status: 404 });
  } catch (err: any) {
    console.error("Error in GET handler:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




