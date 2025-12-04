import React, { useState } from "react";
import { useApiQuery } from "@/hooks/allCMS";
import { useApiMutation } from "@/hooks/postApi";
import { FiEdit, FiTrash2, FiGithub, FiExternalLink } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import EditProjectDialog from "./EditProjectDialog";

const AllProject = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch all projects
  const { data: allProjects, isLoading } = useApiQuery({
    queryKey: "all-projects",
    url: "/api/projects",
    secure: true,
  });

  // Generic mutation for all methods
  const { mutate: apiMutate, isPending: isDeleting } = useApiMutation({
    secure: true,
    successMessage: "Project Deleted Successfully!",
  });

  // When user clicks delete
  const handleDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Confirm delete request
  const confirmDelete = () => {
    apiMutate(
      { method: "delete", customUrl: `/api/projects/${selectedId}` },
      {
        onSuccess: () => {
          setShowModal(false);
          // Refresh updated project list
          queryClient.invalidateQueries(["all-projects"]);
        },
      }
    );
  };

  if (isLoading) return <p className="text-white p-10">Loading...</p>;

  return (
    <div className="min-h-screen  text-white p-8">
      <h1 className="text-3xl font-bold mb-6">All Projects</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProjects?.map((project) => (
          <div
            key={project._id}
            className="bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-gray-600 transition overflow-hidden"
          >
            <img
              src={project?.image}
              alt={project?.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-semibold">{project?.title}</h2>

              <p className="text-gray-400 mt-2">{project?.description}</p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mt-3">
                {(Array.isArray(project?.technologies)
                  ? project.technologies
                  : typeof project?.technologies === "string"
                  ? project.technologies.split(",")
                  : []
                ).map((tech, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-800 px-2 py-1 rounded-md border border-gray-700"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>

              {/* Stack */}
              <p className="text-sm text-gray-300 mt-3">
                <span className="font-semibold">Stack:</span> {project?.stack}
              </p>

              {/* Links */}
              <div className="flex items-center gap-4 mt-4">
                <a
                  href={project?.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-500"
                >
                  <FiGithub /> GitHub
                </a>

                <a
                  href={project?.live}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-green-400 hover:text-green-500"
                >
                  <FiExternalLink /> Live
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-5">
               <EditProjectDialog project={project} />

                <button
                  className="p-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
                  onClick={() => handleDelete(project?._id)}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
            <p className="text-gray-400 mt-3">
              Are you sure you want to delete this project?
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
};

export default AllProject;
