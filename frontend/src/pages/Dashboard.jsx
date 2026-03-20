import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/resume-history/")
      .then((res) => setResumes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">
        Resume History Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {resumes.map((resume) => {
          const extension = resume.filename
            ?.split(".")
            .pop()
            ?.toLowerCase();

          return (
            <div
              key={resume.id}
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              {/* Top Section */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {resume.filename}
                </h2>

                <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                  {extension === "pdf"
                    ? "📄 PDF"
                    : extension === "docx"
                    ? "📝 DOCX"
                    : "📁 FILE"}
                </span>
              </div>

              {/* Upload Date */}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Uploaded on: {resume.created_at}
              </p>

              {/* Top Role */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Top Role:{" "}
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {resume.top_role}
                </span>
              </p>

              {/* Score */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${resume.score}%` }}
                  ></div>
                </div>

                <p className="text-right text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                  {resume.score}%
                </p>
              </div>

              {/* Skills */}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                Skills: {resume.skills}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
