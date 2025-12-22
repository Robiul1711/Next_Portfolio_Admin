import React, { useState } from "react";

const PostBlogPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Using your working endpoint logic
      // ✅ Correct way in Vite
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blogs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, image }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Success!
      setMessage({ type: "success", text: `Blog created successfully!` });
      setPrompt("");
      setImage("");
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-6 bg-gray-900 rounded-lg shadow-xl mt-10 border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-white">AI Blog Generator</h2>

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            What should this blog be about?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Explain how Quantum Computing changes cybersecurity..."
            required
            rows="4"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all"
          />
        </div>

        {/* Image URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Cover Image URL
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            required
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 text-white font-semibold rounded-md transition-colors flex items-center justify-center
            ${
              loading
                ? "bg-blue-900 cursor-not-allowed opacity-70"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Content...
            </>
          ) : (
            "✨ Generate Magic Blog"
          )}
        </button>
      </form>

      {/* Status Messages */}
      {message && (
        <div
          className={`mt-4 p-4 rounded-md border ${
            message.type === "success"
              ? "bg-green-900/30 border-green-800 text-green-300"
              : "bg-red-900/30 border-red-800 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default PostBlogPrompt;
