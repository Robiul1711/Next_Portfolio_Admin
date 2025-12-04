import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Upload, 
  X, 
  Plus, 
  Code, 
  Globe, 
  Tag, 
  Save, 
  Loader2 
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiEdit } from "react-icons/fi";
import { useApiMutation } from "@/hooks/postApi";
import { useQueryClient } from "@tanstack/react-query";

export default function EditProjectDialog({ project }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(project.image || null);
  const [technologies, setTechnologies] = useState(project.technologies || []);
  const [techInput, setTechInput] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const queryClient = useQueryClient();

  const { 
    register, 
    handleSubmit, 
    setValue, 
    reset,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      title: project.title,
      description: project.description,
      stack: project.stack,
      github: project.github || "",
      live: project.live || "",
    },
  });

  // Initialize technologies
  useEffect(() => {
    if (project.technologies) {
      setTechnologies(Array.isArray(project.technologies) 
        ? project.technologies 
        : project.technologies.split(",").map(t => t.trim()).filter(t => t)
      );
    }
    if (project.image) {
      setPreview(project.image);
    }
  }, [project, open]);

  // UPDATE MUTATION
  const { mutate, isPending } = useApiMutation({
    secure: true,
    successMessage: "Project updated successfully!",
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("stack", data.stack);
    formData.append("github", data.github || "");
    formData.append("live", data.live || "");
    formData.append("technologies", technologies.join(", "));

    if (imageFile instanceof File) {
      formData.append("image", imageFile);
    }

    mutate(
      {
        method: "put",
        customUrl: `/api/projects/${project._id}`,
        data: formData,
      },
      {
        onSuccess: (res) => {
          // Update local state with response data
          const updatedProject = res.updatedProject || res.data;
          if (updatedProject) {
            setTechnologies(updatedProject.technologies || []);
            if (updatedProject.image) setPreview(updatedProject.image);
          }
          
          setOpen(false);
          queryClient.invalidateQueries(["all-projects"]);
        },
      }
    );
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove image
  const removeImage = () => {
    setPreview(null);
    setImageFile(null);
    setValue("image", null);
  };

  // Add technology
  const addTechnology = () => {
    const tech = techInput.trim();
    if (tech && !technologies.includes(tech)) {
      const updated = [...technologies, tech];
      setTechnologies(updated);
      setTechInput("");
    }
  };

  const removeTechnology = (tech) => {
    const updated = technologies.filter((t) => t !== tech);
    setTechnologies(updated);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105">
          <FiEdit size={18} className="text-white" />
        </button>
      </DialogTrigger>

      {/* Modal */}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-lg border border-gray-800 rounded-2xl">
        <DialogHeader className="pb-4 border-b border-gray-800">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            Edit Project
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update project details and click Save Changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title
                </label>
                <input
                  {...register("title", { required: "Project title is required" })}
                  type="text"
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
                )}
              </div>

              {/* Stack */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Stack
                </label>
                <select
                  {...register("stack")}
                  className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                >
                  <option value="">Select stack</option>
                  <option value="MERN">MERN Stack</option>
                  <option value="Next.js">Next.js</option>
                  <option value="React Native">React Native</option>
                  <option value="Vue">Vue.js</option>
                  <option value="Angular">Angular</option>
                  <option value="Flutter">Flutter</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Technologies Used
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add technology and press Enter"
                    className="flex-1 p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="px-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Image
              </label>
              <div className="relative">
                <div className="border-2 border-dashed border-gray-700 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-colors group">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Project preview"
                        className="w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-sm text-gray-400 mt-2">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                      <p className="text-gray-400 mb-1">Drag & drop or click to upload</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Description
            </label>
            <textarea
              {...register("description", { 
                required: "Description is required",
                minLength: {
                  value: 50,
                  message: "Description should be at least 50 characters"
                }
              })}
              rows="4"
              className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>

          {/* Links Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" />
                GitHub Repository
              </label>
              <input
                {...register("github")}
                type="text"
                placeholder="github.com/username/repo"
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Live Demo URL
              </label>
              <input
                {...register("live")}
                type="text"
                placeholder="https://your-project.com"
                className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="pt-6 border-t border-gray-800">
            <DialogClose asChild>
              <button
                type="button"
                className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors border border-gray-700"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}