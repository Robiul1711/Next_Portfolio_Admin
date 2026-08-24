import React, { useState, useMemo } from "react";
import { useApiQuery } from "@/hooks/allCMS";
import { useApiMutation } from "@/hooks/postApi";
import { useQueryClient } from "@tanstack/react-query";
import {
  FiTrash2,
  FiPlus,
  FiFileText,
  FiClock,
  FiSearch,
  FiTag,
  FiArrowUpRight,
  FiAlertTriangle,
} from "react-icons/fi";
import { MdAutoAwesome } from "react-icons/md";
import { Link } from "react-router-dom";

const ShowAllBlog = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");

  const queryClient = useQueryClient();

  // Fetch all blogs
  const { data: allBlogs, isLoading } = useApiQuery({
    queryKey: "all-blogs",
    url: "/api/blogs",
    secure: false,
  });

  // Delete mutation
  const { mutate: apiMutate, isPending: isDeleting } = useApiMutation({
    secure: false,
    successMessage: "Blog Deleted Successfully!",
  });

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    apiMutate(
      { method: "delete", customUrl: `/api/blogs/${selectedId}` },
      {
        onSuccess: () => {
          setShowModal(false);
          setSelectedId(null);
          queryClient.invalidateQueries(["all-blogs"]);
          queryClient.invalidateQueries(["dashboard-stats"]);
        },
      }
    );
  };

  // Extract unique tags
  const tags = useMemo(() => {
    if (!allBlogs || !Array.isArray(allBlogs)) return [];
    const set = new Set();
    allBlogs.forEach((b) => b.tag && set.add(b.tag.trim()));
    return ["ALL", ...Array.from(set)];
  }, [allBlogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    if (!allBlogs || !Array.isArray(allBlogs)) return [];
    return allBlogs.filter((b) => {
      const matchSearch =
        b?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b?.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = selectedTag === "ALL" ? true : b?.tag?.trim() === selectedTag;
      return matchSearch && matchTag;
    });
  }, [allBlogs, searchQuery, selectedTag]);

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FiFileText className="text-purple-400" />
            Blog & Article Studio
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Browse and manage all published tech and AI-generated articles.
          </p>
        </div>

        <Link
          to="/dashboard/add-blogs"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-95 self-start sm:self-auto"
        >
          <MdAutoAwesome className="text-base" />
          <span>Write / Generate Blog</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title or keyword..."
            className="w-full bg-slate-900/70 border border-slate-800 focus:border-purple-500/50 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {tags.slice(0, 5).map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                selectedTag === tag
                  ? "bg-purple-600/30 text-purple-300 border-purple-500/50"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse"
            />
          ))
        ) : filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="group bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                {/* Image */}
                <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  <span className="absolute top-3 left-3 bg-purple-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-md backdrop-blur-md">
                    {blog.tag || "Technology"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <FiClock size={12} /> {blog.readTime || "4 min read"}
                    </span>
                    <span>•</span>
                    <span>{blog.date || "Recently"}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-purple-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Article View <FiArrowUpRight />
                </span>

                <button
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Delete Article"
                >
                  <FiTrash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <FiFileText className="mx-auto text-5xl mb-3 text-slate-600" />
            <h3 className="text-base font-semibold text-slate-300">No blog articles found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No articles matching "${searchQuery}".`
                : "Create an AI-generated or custom article to populate your portfolio blog."}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
                <FiAlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Blog Article</h3>
                <p className="text-xs text-slate-400">This action will delete the article from database.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              Are you sure you want to permanently delete this blog post?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <FiTrash2 size={14} />
                <span>{isDeleting ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAllBlog;