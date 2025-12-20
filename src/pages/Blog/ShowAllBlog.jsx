import React, { useEffect, useState } from 'react';

const ShowAllBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Blogs on Load
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/blogs`);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from UI immediately without refreshing
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (loading) return <div className="text-center py-10">Loading awesome content...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold  mb-8 text-center">
        Latest AI Generated Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div 
            key={blog._id} 
            className="border border-gray-800 text-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            {/* Blog Image */}
            <div className="h-48 overflow-hidden relative">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {blog.tag}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center text-sm mb-3 space-x-4">
                <span>{blog.date}</span>
                <span className="w-1 h-1  rounded-full"></span>
                <span>{blog.readTime}</span>
              </div>

              <h3 className="text-xl font-bold  mb-3 leading-tight">
                {blog.title}
              </h3>

              <p className=" mb-4 line-clamp-3 flex-1">
                {blog.excerpt}
              </p>

              {/* Action Buttons */}
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Read More →
                </button>
                
                <div className="flex space-x-2">
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                    title="Delete Blog"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No blogs found. Try generating one!
        </div>
      )}
    </div>
  );
}

export default ShowAllBlog;