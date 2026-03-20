import { useState } from "react";
import axios from "axios";

function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/upload-resume",
        formData
      );
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Backend error");
    } finally {
      setLoading(false);
    }
  };

  const resumeScore =
    result?.recommended_jobs?.length > 0
      ? result.recommended_jobs[0].match_score
      : 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center py-10 px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-3xl shadow-2xl w-full max-w-3xl p-8 transition-colors duration-300">

        <h2 className="text-2xl font-bold text-center mb-6">
          Analyze Your Resume
        </h2>

        {/* Upload Section */}
        <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-500 rounded-lg p-6 text-center hover:bg-indigo-50 dark:hover:bg-gray-700 transition">
          <input
            type="file"
            className="hidden"
            id="fileUpload"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer text-gray-600 dark:text-gray-300"
          >
            {file ? (
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {file.name}
              </span>
            ) : (
              "Click to upload your resume (PDF/DOCS)"
            )}
          </label>
        </div>

        <button
          onClick={handleUpload}
          className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transform transition duration-300 text-white py-3 rounded-xl font-semibold shadow-md"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {result && !loading && (
          <div className="mt-10 space-y-8">

            {/* Resume Score */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Resume Score
              </h3>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-700"
                  style={{ width: `${resumeScore}%` }}
                ></div>
              </div>

              <p className="text-right mt-1 font-semibold text-indigo-600 dark:text-indigo-400">
                {resumeScore}%
              </p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Skills Detected
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.skills_detected?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Jobs */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Recommended Roles
              </h3>

              <div className="space-y-3">
                {result.recommended_jobs?.map((job, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
                  >
                    <span className="font-medium">
                      {job.title}
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {job.match_score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Home;
