import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, X, Plus, Code, Globe, Tag, ArrowLeft } from "lucide-react";
import { useApiMutation } from "@/hooks/postApi";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { FiFolderPlus } from "react-icons/fi";

const AddProjects = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [techInput, setTechInput] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // POST mutation
  const { mutate, isPending } = useApiMutation({
    url: "/api/projects",
    method: "post",
    secure: true,
    successMessage: "Project Added Successfully!",
  });

  // SUBMIT FORM
  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("stack", data.stack || "Full Stack");
    formData.append("github", data.github || "");
    formData.append("live", data.live || "");
    formData.append("popular", data.popular === "true");
    formData.append("technologies", technologies.join(", "));

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    mutate(
      {
        data: formData,
      },
      {
        onSuccess: () => {
          reset();
          setPreview(null);
          setTechnologies([]);
          setTechInput("");
          queryClient.invalidateQueries(["all-projects"]);
          queryClient.invalidateQueries(["dashboard-stats"]);
          navigate("/dashboard/all-project");
        },
      }
    );
  };

  // Image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Add technology
  const addTechnology = () => {
    const tech = techInput.trim();
    if (tech && !technologies.includes(tech)) {
      const updated = [...technologies, tech];
      setTechnologies(updated);
      setValue("technologies", updated);
      setTechInput("");
    }
  };

  const removeTechnology = (tech) => {
    const updated = technologies.filter((t) => t !== tech);
    setTechnologies(updated);
    setValue("technologies", updated);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <div className="space-y-6 pb-12 pt-2 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <Link
            to="/dashboard/all-project"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to all projects
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FiFolderPlus className="text-blue-400" />
            Add New Portfolio Project
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Provide details, live demo links, source code, and cover image to publish a new project.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Title */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("title", { required: "Project title is required" })}
                type="text"
                placeholder="e.g. Next.js SaaS Dashboard"
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
              {errors.title && (
                <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Project Stack */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                Primary Architecture / Stack
              </label>
              <select
                {...register("stack")}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all"
              >
                <option value="MERN">MERN Stack</option>
                <option value="Next.js Fullstack">Next.js Fullstack</option>
                <option value="React + Node.js">React + Node.js</option>
                <option value="Python Django/FastAPI">Python Django/FastAPI</option>
                <option value="Mobile App (Flutter/React Native)">Mobile App (Flutter/React Native)</option>
              </select>
            </div>
          </div>

          {/* Featured Toggle & Technologies */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Technologies */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                <Tag size={15} className="text-blue-400" /> Technologies Used
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="e.g. TailwindCSS, TypeScript"
                  className="flex-1 bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Badges List */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {technologies?.map((tech, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-300 rounded-lg border border-blue-500/20 text-xs"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="hover:text-rose-400 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Popular Project Status */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                Featured / Popular Badge
              </label>
              <select
                {...register("popular")}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all"
              >
                <option value="false">Standard Project</option>
                <option value="true">★ Featured Showcase Project</option>
              </select>
            </div>
          </div>

          {/* Project Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-white">
              Project Thumbnail / Cover Image
            </label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-950/30">
              {preview ? (
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border border-slate-700 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setValue("image", null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-colors cursor-pointer shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">Click or drag image to upload</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP formats up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-white">
              Project Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              rows="4"
              placeholder="Describe the problem, key features, architecture, and tech choices..."
              className="w-full p-4 bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none transition-all resize-y"
            />
            {errors.description && (
              <p className="text-rose-400 text-xs">{errors.description.message}</p>
            )}
          </div>

          {/* Links */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                <Code size={15} className="text-blue-400" /> GitHub Repository URL
              </label>
              <input
                {...register("github")}
                type="url"
                placeholder="https://github.com/username/project"
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                <Globe size={15} className="text-blue-400" /> Live Demo URL
              </label>
              <input
                {...register("live")}
                type="url"
                placeholder="https://my-live-project.com"
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiFolderPlus size={18} />
              <span>{isPending ? "Publishing Project..." : "Publish Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjects;
