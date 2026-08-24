import React, { useState, useMemo } from "react";
import { useApiQuery } from "@/hooks/allCMS";
import { useApiMutation } from "@/hooks/postApi";
import {
  FiEdit,
  FiTrash2,
  FiGithub,
  FiExternalLink,
  FiPlus,
  FiSearch,
  FiFolder,
  FiStar,
  FiAlertTriangle,
} from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import EditProjectDialog from "./EditProjectDialog";

const AllProject = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPopular, setFilterPopular] = useState(false);

  const queryClient = useQueryClient();

  // Fetch all projects
  const { data: allProjects, isLoading } = useApiQuery({
    queryKey: "all-projects",
    url: "/api/projects",
    secure: true,
  });

  // Delete mutation
  const { mutate: apiMutate, isPending: isDeleting } = useApiMutation({
    secure: true,
    successMessage: "Project Deleted Successfully!",
  });

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    apiMutate(
      { method: "delete", customUrl: `/api/projects/${selectedId}` },
      {
        onSuccess: () => {
          setShowModal(false);
          setSelectedId(null);
          queryClient.invalidateQueries(["all-projects"]);
          queryClient.invalidateQueries(["dashboard-stats"]);
        },
      }
    );
  };

  // Filter projects by search and popular status
  const filteredProjects = useMemo(() => {
    if (!allProjects || !Array.isArray(allProjects)) return [];
    return allProjects.filter((p) => {
      const matchSearch =
        p?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p?.stack?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPopular = filterPopular ? p?.popular === true : true;
      return matchSearch && matchPopular;
    });
  }, [allProjects, searchQuery, filterPopular]);

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FiFolder className="text-blue-400" />
            Project Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage, edit, or remove projects showcasing on your live portfolio website.
          </p>
        </div>

        <Link
          to="/dashboard/add-project"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 self-start sm:self-auto"
        >
          <FiPlus className="text-base" />
          <span>Add New Project</span>
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
            placeholder="Search projects by title, stack, or description..."
            className="w-full bg-slate-900/70 border border-slate-800 focus:border-blue-500/50 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={() => setFilterPopular(!filterPopular)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
            filterPopular
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <FiStar className={filterPopular ? "fill-amber-400 text-amber-400" : ""} />
          <span>Featured Only</span>
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse"
            />
          ))
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project._id}
              className="group bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                {/* Image Container */}
                <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
                  <img
                    src={project?.image}
                    alt={project?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[11px] font-bold bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                      {project?.stack || "Full Stack"}
                    </span>
                    {project?.popular && (
                      <span className="text-[11px] font-bold bg-amber-500/90 text-slate-950 px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                        <FiStar size={11} className="fill-slate-950" /> Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {project?.title}
                  </h2>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project?.description}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(Array.isArray(project?.technologies)
                      ? project.technologies
                      : typeof project?.technologies === "string"
                      ? project.technologies.split(",")
                      : []
                    )
                      .slice(0, 5)
                      .map((tech, index) => (
                        <span
                          key={index}
                          className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="p-4 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between">
                {/* External Links */}
                <div className="flex items-center gap-2">
                  {project?.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
                      title="GitHub Source"
                    >
                      <FiGithub size={13} />
                    </a>
                  )}
                  {project?.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 transition-colors text-xs flex items-center gap-1"
                      title="Live Site Preview"
                    >
                      <FiExternalLink size={13} />
                    </a>
                  )}
                </div>

                {/* Edit / Delete Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditProject(project)}
                    className="p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Edit Project"
                  >
                    <FiEdit size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Delete Project"
                  >
                    <FiTrash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <FiFolder className="mx-auto text-5xl mb-3 text-slate-600" />
            <h3 className="text-base font-semibold text-slate-300">No projects found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No projects matching "${searchQuery}".`
                : "Get started by adding your first showcase project."}
            </p>
          </div>
        )}
      </div>

      {/* Edit Project Dialog */}
      {editProject && (
        <EditProjectDialog
          project={editProject}
          onClose={() => setEditProject(null)}
          onSuccess={() => {
            setEditProject(null);
            queryClient.invalidateQueries(["all-projects"]);
            queryClient.invalidateQueries(["dashboard-stats"]);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
                <FiAlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Project</h3>
                <p className="text-xs text-slate-400">This action will remove the project permanently.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              Are you sure you want to delete this project from your portfolio?
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

export default AllProject;
