"use client";

import { useEffect, useState } from "react";

interface File {
  id: number;
  file_url: string;
  relative_path: string;
  uploaded_at: string;
  is_zip: boolean;
  name?: string;
  size?: number;
  content?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  topics: string[];
  files: File[];
}

interface PreviewFile {
  id: number;
  relative_path: string;
  content: string;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [zipContents, setZipContents] = useState<{ [key: number]: File[] }>({});
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [curatedPath, setCuratedPath] = useState({
    suggestedCourses: [
      { id: 4, title: "Advanced Python" },
      { id: 5, title: "React Basics" },
    ],
  });
  const [showCuratedPath, setShowCuratedPath] = useState(false);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/feature4/courses/");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setLoading(false);
  };

  const fetchZipContents = async (fileId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/feature4/files/${fileId}/extract/`);
      if (response.ok) {
        const data = await response.json();
        setZipContents((prev) => ({ ...prev, [fileId]: data.contents }));

        // Open the modal to show extracted files
        setPreviewFile({
          id: fileId,
          relative_path: "Extracted ZIP Contents",
          content: JSON.stringify(data.contents, null, 2), // Show extracted contents as JSON
        });
      } else {
        console.error("Error extracting ZIP file.");
      }
    } catch (error) {
      console.error("Error fetching ZIP contents:", error);
    }
  };

  const fetchFileContent = async (file: File) => {
    try {
      const fileUrl = file.file_url.startsWith("http")
        ? file.file_url
        : `http://127.0.0.1:8000${file.file_url}`;

      const response = await fetch(fileUrl);
      if (response.ok) {
        const content = await response.text();
        setPreviewFile({
          id: file.id,
          relative_path: file.relative_path,
          content,
        }); // Show preview modal
      } else {
        console.error("Unable to fetch file content.");
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourseId(courseId);
    setShowCuratedPath(true);
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="flex flex-col md:flex-row p-6 bg-gray-100 min-h-screen">
      {/* Course List */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6 m-4">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Available Courses</h1>
        <ul className="space-y-3">
          {courses.map((course) => (
            <li
              key={course.id}
              onClick={() => handleCourseSelect(course.id)}
              className={`cursor-pointer p-3 rounded-md ${
                selectedCourseId === course.id ? "bg-blue-100" : "hover:bg-blue-50"
              }`}
            >
              <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
              <p className="text-gray-500 text-sm">{course.description}</p>
              <ul className="mt-2">
                {course.files.map((file) => (
                  <li key={file.id} className="text-sm text-gray-600 flex items-center space-x-2">
                    {file.is_zip ? (
                      <button
                        className="text-blue-600 underline"
                        onClick={() => fetchZipContents(file.id)}
                      >
                        {file.relative_path || "ZIP File"} (Extract)
                      </button>
                    ) : (
                      <button
                        className="text-green-600 underline"
                        onClick={() => fetchFileContent(file)}
                      >
                        {file.relative_path || "File"} (Preview)
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Curated Path */}
      {showCuratedPath && (
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 m-4">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Curated Learning Path</h2>
          <ul className="space-y-3">
            {curatedPath.suggestedCourses.map((suggestedCourse) => (
              <li key={suggestedCourse.id} className="p-3 bg-green-50 rounded-md">
                <h3 className="text-lg font-semibold text-gray-800">{suggestedCourse.title}</h3>
              </li>
            ))}
          </ul>
        </div>
      )}

{/* File Preview Modal */}
{previewFile && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mt-[90px]">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {previewFile.relative_path || "File Preview"}
      </h3>
      {zipContents[previewFile.id] ? (
        // Display extracted files from the ZIP
        <ul className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm space-y-2">
          {zipContents[previewFile.id].map((content, index) => (
            <li key={index} className="border-b pb-2">
              <strong className="block">{content.name}</strong>
              <span className="block text-gray-600">{content.size} bytes</span>
              {content.content && (
                <pre className="bg-gray-200 p-2 rounded-lg mt-2 overflow-auto">
                  {content.content}
                </pre>
              )}
            </li>
          ))}
        </ul>
      ) : (
        // Display raw file content or fallback text
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
          {previewFile.content || "No content available"}
        </pre>
      )}
      <button
        onClick={() => setPreviewFile(null)}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default CoursesPage;


