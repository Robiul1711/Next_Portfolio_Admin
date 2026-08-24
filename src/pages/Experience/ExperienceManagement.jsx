import React, { useState, useMemo } from "react";
import { useApiQuery } from "@/hooks/allCMS";
import { useApiMutation } from "@/hooks/postApi";
import { useQueryClient } from "@tanstack/react-query";
import {
  FiBriefcase,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiAlertTriangle,
  FiBookOpen,
  FiTag,
  FiX,
} from "react-icons/fi";

const ExperienceManagement = () => {
  const [selectedType, setSelectedType] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    type: "Experience",
    title: "",
    company: "",
    location: "",
    year: "2024 - Present",
    description: "",
    skills: [],
    status: "Current",
  });

  const queryClient = useQueryClient();

  // Fetch all experiences
  const { data: expResponse, isLoading } = useApiQuery({
    queryKey: "all-experiences",
    url: "/api/experiences",
    secure: true,
  });

  const experiences = expResponse?.data || [];

  // Create / Update mutation
  const { mutate: saveMutation, isPending: isSaving } = useApiMutation({
    secure: true,
    successMessage: selectedExp ? "Record updated successfully!" : "Record added successfully!",
  });

  // Delete mutation
  const { mutate: deleteMutation, isPending: isDeleting } = useApiMutation({
    secure: true,
    successMessage: "Record deleted successfully!",
  });

  const handleOpenAdd = () => {
    setSelectedExp(null);
    setFormData({
      type: "Experience",
      title: "",
      company: "",
      location: "Dhaka, Bangladesh",
      year: "2024 - Present",
      description: "",
      skills: [],
      status: "Current",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setSelectedExp(exp);
    setFormData({
      type: exp.type || "Experience",
      title: exp.title || "",
      company: exp.company || "",
      location: exp.location || "",
      year: exp.year || "",
      description: exp.description || "",
      skills: Array.isArray(exp.skills) ? exp.skills : [],
      status: exp.status || "Completed",
    });
    setModalOpen(true);
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !formData.skills.includes(val)) {
        setFormData((prev) => ({ ...prev, skills: [...prev.skills, val] }));
        setSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.company.trim()) return;

    if (selectedExp) {
      saveMutation(
        {
          method: "put",
          customUrl: `/api/experiences/${selectedExp._id}`,
          data: formData,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            queryClient.invalidateQueries(["all-experiences"]);
            queryClient.invalidateQueries(["dashboard-stats"]);
          },
        }
      );
    } else {
      saveMutation(
        {
          method: "post",
          customUrl: `/api/experiences`,
          data: formData,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            queryClient.invalidateQueries(["all-experiences"]);
            queryClient.invalidateQueries(["dashboard-stats"]);
          },
        }
      );
    }
  };

  const handleDelete = (exp) => {
    setSelectedExp(exp);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedExp) return;
    deleteMutation(
      {
        method: "delete",
        customUrl: `/api/experiences/${selectedExp._id}`,
      },
      {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedExp(null);
          queryClient.invalidateQueries(["all-experiences"]);
          queryClient.invalidateQueries(["dashboard-stats"]);
        },
      }
    );
  };

  const filteredExperiences = useMemo(() => {
    if (selectedType === "ALL") return experiences;
    return experiences.filter((e) => e.type === selectedType);
  }, [experiences, selectedType]);

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FiBriefcase className="text-blue-400" />
            Career & Education Timeline CMS
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your employment history, engineering experience, and academic degrees shown on the timeline roadmap.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <FiPlus className="text-base" />
          <span>Add Timeline Item</span>
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-2">
        {["ALL", "Experience", "Education"].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              selectedType === t
                ? "bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {t === "ALL" ? "All Timeline Items" : t === "Experience" ? "💼 Work History" : "🎓 Education"}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse" />
          ))
        ) : filteredExperiences.length > 0 ? (
          filteredExperiences.map((exp) => (
            <div
              key={exp._id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl backdrop-blur-md transition-all group hover:shadow-xl relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-md shrink-0 ${
                      exp.type === "Education"
                        ? "bg-gradient-to-tr from-purple-600 to-pink-600 text-white"
                        : "bg-gradient-to-tr from-blue-600 to-cyan-600 text-white"
                    }`}
                  >
                    {exp.type === "Education" ? <FiBookOpen /> : <FiBriefcase />}
                  </div>

                  {/* Body */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                        {exp.title}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-blue-400 border border-slate-700">
                        {exp.year}
                      </span>
                      {exp.status === "Current" && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ● Current
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-300">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </p>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-3xl pt-1">
                      {exp.description}
                    </p>

                    {/* Skill Tags */}
                    {exp.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="p-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <FiEdit size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(exp)}
                    className="p-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <FiTrash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <FiBriefcase className="mx-auto text-5xl mb-3 text-slate-600" />
            <h3 className="text-base font-semibold text-slate-300">No timeline items found</h3>
            <p className="text-xs text-slate-500 mt-1">Add your career experiences or degrees to show on the roadmap.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FiBriefcase className="text-blue-400" />
                {selectedExp ? "Edit Timeline Entry" : "Add Timeline Entry"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Type */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Category Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none"
                  >
                    <option value="Experience">💼 Work Experience</option>
                    <option value="Education">🎓 Education / Degree</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">Employment Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none"
                  >
                    <option value="Current">Current / Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Title & Company */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  Role Title / Degree <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Frontend Developer or B.Sc. Computer Science"
                  required
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Company / Institution <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Softvence Alpha"
                    required
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Duration / Year <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. 2024 - Present"
                    required
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  Description & Key Responsibilities <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Architected responsive interfaces, managed full-stack REST integrations..."
                  required
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl p-3 text-sm text-slate-200 outline-none resize-y"
                />
              </div>

              {/* Skill Tags */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Technologies & Skills Used</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill(e)}
                    placeholder="Type skill & press Enter (e.g. Next.js, Redux)"
                    className="flex-1 bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {formData.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : selectedExp ? "Update Record" : "Save Record"}
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
                <h3 className="text-base font-bold text-white">Delete Timeline Record</h3>
                <p className="text-xs text-slate-400">Remove "{selectedExp?.title}"?</p>
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

export default ExperienceManagement;
