import React, { useState, useMemo } from "react";
import { useApiQuery } from "@/hooks/allCMS";
import { useApiMutation } from "@/hooks/postApi";
import { useQueryClient } from "@tanstack/react-query";
import {
  FiLayers,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiCheck,
  FiAlertTriangle,
  FiSliders,
} from "react-icons/fi";

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps/Tools", "Languages", "Other"];

const COLOR_PRESETS = [
  "#06B6D4", // Cyan
  "#61DAFB", // React Blue
  "#3178C6", // TypeScript Blue
  "#339933", // Node Green
  "#47A248", // Mongo Green
  "#3ECF8E", // Supabase Teal
  "#EA4B71", // n8n Pink
  "#A855F7", // Purple
  "#F59E0B", // Amber
];

const SkillsManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    level: 85,
    color: "#06B6D4",
    iconName: "Code",
  });

  const queryClient = useQueryClient();

  // Fetch all skills
  const { data: skillsResponse, isLoading } = useApiQuery({
    queryKey: "all-skills",
    url: "/api/skills",
    secure: true,
  });

  const skills = skillsResponse?.data || [];

  // Create / Update mutation
  const { mutate: saveSkillMutation, isPending: isSaving } = useApiMutation({
    secure: true,
    successMessage: selectedSkill ? "Skill updated successfully!" : "Skill created successfully!",
  });

  // Delete mutation
  const { mutate: deleteSkillMutation, isPending: isDeleting } = useApiMutation({
    secure: true,
    successMessage: "Skill deleted successfully!",
  });

  const handleOpenAddModal = () => {
    setSelectedSkill(null);
    setFormData({
      name: "",
      category: "Frontend",
      level: 85,
      color: "#06B6D4",
      iconName: "Code",
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name || "",
      category: skill.category || "Frontend",
      level: skill.level ?? 85,
      color: skill.color || "#06B6D4",
      iconName: skill.iconName || "Code",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (selectedSkill) {
      // Update
      saveSkillMutation(
        {
          method: "put",
          customUrl: `/api/skills/${selectedSkill._id}`,
          data: formData,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            queryClient.invalidateQueries(["all-skills"]);
            queryClient.invalidateQueries(["dashboard-stats"]);
          },
        }
      );
    } else {
      // Create
      saveSkillMutation(
        {
          method: "post",
          customUrl: `/api/skills`,
          data: formData,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            queryClient.invalidateQueries(["all-skills"]);
            queryClient.invalidateQueries(["dashboard-stats"]);
          },
        }
      );
    }
  };

  const handleDelete = (skill) => {
    setSelectedSkill(skill);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedSkill) return;
    deleteSkillMutation(
      {
        method: "delete",
        customUrl: `/api/skills/${selectedSkill._id}`,
      },
      {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedSkill(null);
          queryClient.invalidateQueries(["all-skills"]);
          queryClient.invalidateQueries(["dashboard-stats"]);
        },
      }
    );
  };

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchCat = selectedCategory === "ALL" || s.category === selectedCategory;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FiLayers className="text-cyan-400" />
            Skills & Tech Stack CMS
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your technical skills, proficiency levels, and ecosystem badges displayed on your live portfolio.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <FiPlus className="text-base" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name (e.g. Next.js, Node, MongoDB)..."
            className="w-full bg-slate-900/70 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["ALL", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "bg-cyan-600/20 text-cyan-300 border-cyan-500/40 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map((n) => (
            <div key={n} className="h-36 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse" />
          ))
        ) : filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <div
              key={skill._id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl backdrop-blur-md transition-all hover:shadow-xl group relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: skill.color || "#06B6D4" }}
                    />
                    <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h3>
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                    {skill.category}
                  </span>
                </div>

                {/* Proficiency Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-medium text-slate-400">
                    <span>Proficiency</span>
                    <span className="text-white font-bold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.color || "#06B6D4",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditModal(skill)}
                  className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs transition-colors cursor-pointer"
                  title="Edit Skill"
                >
                  <FiEdit size={13} />
                </button>
                <button
                  onClick={() => handleDelete(skill)}
                  className="p-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs transition-colors cursor-pointer"
                  title="Delete Skill"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <FiLayers className="mx-auto text-5xl mb-3 text-slate-600" />
            <h3 className="text-base font-semibold text-slate-300">No skills found</h3>
            <p className="text-xs text-slate-500 mt-1">Add your technical skills to showcase on your portfolio.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Skill Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FiSliders className="text-cyan-400" />
                {selectedSkill ? "Edit Technical Skill" : "Add New Skill"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Skill Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  Skill Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Next.js, Docker, Python"
                  required
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Proficiency Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Proficiency Level</span>
                  <span className="text-cyan-400">{formData.level}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Accent Color Preset */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">Badge Accent Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer border ${
                        formData.color === color ? "scale-125 border-white" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    title="Custom color picker"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : selectedSkill ? "Update Skill" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
                <FiAlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Skill</h3>
                <p className="text-xs text-slate-400">Remove "{selectedSkill?.name}" from portfolio?</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManagement;
