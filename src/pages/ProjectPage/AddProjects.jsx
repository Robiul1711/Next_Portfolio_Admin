import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, X, Plus, Code, Globe, Tag } from "lucide-react";
import { useApiMutation } from "@/hooks/postApi";

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
    formData.append("stack", data.stack);
    formData.append("github", data.github || "");
    formData.append("live", data.live || "");
    formData.append("popular", data.popular || "");

    // ✔ send as single string (matches Postman)
    formData.append("technologies", technologies.join(", "));

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    mutate(
      {
        data: formData, // ✔ correct place
      },
      {
        onSuccess: () => {
          reset();
          setPreview(null);
          setTechnologies([]);
          setTechInput("");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex justify-center items-center py-10 px-5">
      <div className="w-full max-w-4xl">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Add New Project
          </h1>
          <p className="text-gray-400">
            Showcase your work with detailed information
          </p>
        </div>

        {/* CARD */}
        <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-2xl">
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* LEFT */}
                <div className="space-y-8">
                  {/* Title */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Project Title
                    </label>
                    <input
                      {...register("title", {
                        required: "Project title is required",
                      })}
                      type="text"
                      placeholder="Enter project name"
                      className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white"
                    />
                    {errors.title && (
                      <p className="text-red-400 text-sm">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Project Stack
                    </label>
                    <select
                      {...register("stack")}
                      className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white"
                    >
                      <option value="">Select stack</option>
                      <option value="MERN">MERN</option>
                      <option value="Next.js">Next.js</option>
                      <option value="React Native">React Native</option>
                      <option value="Vue">Vue.js</option>
                      <option value="Angular">Angular</option>
                    </select>
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Technologies Used
                    </label>

                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add technology"
                        className="flex-1 p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white"
                      />
                      <button
                        type="button"
                        onClick={addTechnology}
                        className="px-6 rounded-xl bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {technologies?.map((tech, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechnology(tech)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* popular  */}
                </div>

                {/* RIGHT – IMAGE */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Popular Project
                    </label>

                    <select
                      {...register("popular")}
                      className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white"
                    >
                      <option value="">Select option</option>
                      <option value="true">Yes (Popular)</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Project Image
                    </label>

                    <div className="relative border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors">
                      {preview ? (
                        <div className="relative w-full">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              setValue("image", null);
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-600 rounded-full hover:bg-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 mb-2">Click to upload</p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG, WEBP up to 5MB
                          </p>
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

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Project Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 50,
                      message: "At least 50 characters",
                    },
                  })}
                  rows="4"
                  className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white"
                />
                {errors.description && (
                  <p className="text-red-400 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* LINKS */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4" /> GitHub Repository
                  </label>
                  <input
                    {...register("github")}
                    placeholder="github.com/user/repo"
                    className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Live Demo URL
                  </label>
                  <input
                    {...register("live")}
                    placeholder="https://yourwebsite.com"
                    className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white"
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg"
              >
                {isPending ? "Adding..." : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjects;
