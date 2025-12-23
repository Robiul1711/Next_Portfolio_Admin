import { useApiQuery } from '@/hooks/allCMS';
import { useApiMutation } from '@/hooks/postApi';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const ShowAllBlog = () => {

    const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch all allBlogs
  const { data: allBlogs, isLoading , error: allBlogsError} = useApiQuery({
    queryKey: "all-blogs",
    url: "/api/blogs",
    secure: false,
  });

    // Generic mutation for all methods
    const { mutate: apiMutate, isPending: isDeleting } = useApiMutation({
      secure: false,
      successMessage: "Blog Deleted Successfully!",
    });
    // When user clicks delete
  const handleDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Confirm delete request
  const confirmDelete = () => {
    apiMutate(
      { method: "delete", customUrl: `/api/blogs/${selectedId}` },
      {
        onSuccess: () => {
          setShowModal(false);
          // Refresh updated project list
          queryClient.invalidateQueries(["all-blogs"]);
        },
      }
    );
  };

  if (isLoading) return <div className="text-center py-10">Loading awesome content...</div>;
  if (allBlogsError) return <div className="text-center py-10 text-red-500">Error: {allBlogsError}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold  mb-8 text-center">
        Latest AI Generated Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allBlogs?.map((blog) => (
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
                    onClick={() => handleDelete(blog?._id)}
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

      {allBlogs.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No blogs found. Try generating one!
        </div>
      )}
            {/* DELETE CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
            <p className="text-gray-400 mt-3">
              Are you sure you want to delete this blog?
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowAllBlog;