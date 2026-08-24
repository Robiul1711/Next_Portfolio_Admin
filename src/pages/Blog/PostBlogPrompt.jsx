import React, { useState } from "react";
import { FiImage, FiArrowLeft, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { MdAutoAwesome } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const PostBlogPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const suggestedPrompts = [
    "How Modern Next.js 15 & React 19 change Web Development in 2026",
    "Building Scalable REST and GraphQL APIs with Node.js and MongoDB",
    "Tailwind CSS v4: Key Architecture Upgrades and Best Practices",
    "Integrating AI LLM Models into Modern Web Applications",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate blog article");
      }

      setMessage({ type: "success", text: "AI Blog generated and published successfully!" });
      setPrompt("");
      setImage("");
      queryClient.invalidateQueries(["all-blogs"]);
      queryClient.invalidateQueries(["dashboard-stats"]);

      setTimeout(() => {
        navigate("/dashboard/all-blogs");
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 pt-2 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <Link
            to="/dashboard/all-blogs"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mb-2 transition-colors"
          >
            <FiArrowLeft /> Back to all articles
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <MdAutoAwesome className="text-purple-400" />
            AI Blog Generator Studio
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Provide a topic prompt and cover image; our integrated AI will generate a complete technical article with tag, read time, and excerpt.
          </p>
        </div>
      </div>

      {/* Main Studio Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2.5 ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-300 border border-rose-500/20"
            }`}
          >
            {message.type === "success" ? <FiCheckCircle2 size={18} /> : <FiAlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-white">
              Blog Topic / Prompt <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Explain how Server Actions in Next.js simplify state management..."
              required
              rows="4"
              className="w-full p-4 bg-slate-950/60 border border-slate-800 focus:border-purple-500/60 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none transition-all resize-y"
            />

            {/* Suggestions */}
            <div className="pt-2">
              <p className="text-xs text-slate-400 mb-2 font-medium">Quick Topic Ideas:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(s)}
                    className="text-left text-xs bg-slate-800/60 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 border border-slate-700/50 hover:border-purple-500/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-white">
              Cover Image URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                required
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500/60 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Live Image Preview */}
          {image && (
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center gap-4">
              <img
                src={image}
                alt="Preview"
                className="w-20 h-14 rounded-lg object-cover border border-slate-700"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="text-xs text-slate-400">
                <p className="font-semibold text-white">Cover Image Preview</p>
                <p className="truncate max-w-sm">{image}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <MdAutoAwesome className="text-lg animate-spin" />
                <span>AI is Generating Article & Details... (Please wait)</span>
              </>
            ) : (
              <>
                <MdAutoAwesome className="text-lg" />
                <span>Generate & Publish AI Blog Article</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostBlogPrompt;
