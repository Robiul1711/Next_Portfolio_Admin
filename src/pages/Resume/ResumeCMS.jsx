import React, { useState, useEffect } from "react";
import { useApiQuery } from "@/hooks/allCMS";
import { useApiMutation } from "@/hooks/postApi";
import { useQueryClient } from "@tanstack/react-query";
import {
  FiFileText,
  FiDownload,
  FiExternalLink,
  FiSave,
  FiCheckCircle,
  FiLink,
  FiEye,
} from "react-icons/fi";
import { MdOutlineWorkOutline } from "react-icons/md";

const ResumeCMS = () => {
  const [formData, setFormData] = useState({
    title: "Robiul Islam Ashiq - Full Stack Developer CV",
    resumeUrl: "https://drive.google.com/file/d/1YB6dyTDSrI1PcucDpxJZsw7KNvL2S1m4/view?usp=sharing",
    version: "2026.1",
    isAvailableForHire: true,
  });

  const queryClient = useQueryClient();

  // Fetch current resume data
  const { data: resumeResponse, isLoading } = useApiQuery({
    queryKey: "resume-settings",
    url: "/api/resume",
    secure: true,
  });

  useEffect(() => {
    if (resumeResponse?.data) {
      setFormData({
        title: resumeResponse.data.title || "",
        resumeUrl: resumeResponse.data.resumeUrl || "",
        version: resumeResponse.data.version || "2026.1",
        isAvailableForHire: resumeResponse.data.isAvailableForHire ?? true,
      });
    }
  }, [resumeResponse]);

  // Update mutation
  const { mutate: updateResumeMutation, isPending } = useApiMutation({
    url: "/api/resume",
    defaultMethod: "put",
    secure: true,
    successMessage: "Resume settings updated successfully!",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateResumeMutation(
      {
        method: "put",
        customUrl: "/api/resume",
        data: formData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["resume-settings"]);
        },
      }
    );
  };

  return (
    <div className="space-y-6 pb-12 pt-2 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FiFileText className="text-blue-400" />
            Resume & CV Manager
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Update your public Resume/CV download link, hiring status, and document version.
          </p>
        </div>

        {formData.resumeUrl && (
          <a
            href={formData.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 self-start sm:self-auto"
          >
            <FiDownload />
            <span>Test Download Link</span>
            <FiExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Main Settings Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Title */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-white">
              CV Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Robiul Islam Ashiq - Full Stack Developer CV"
              required
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all"
            />
          </div>

          {/* Resume Direct Link */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-white flex items-center gap-2">
              <FiLink className="text-blue-400" /> Public Resume URL (Google Drive / Cloudinary / PDF Link){" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/..."
              required
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
            />
            <p className="text-xs text-slate-400">
              Paste your shareable Google Drive link (make sure permission is set to <i>"Anyone with the link can view"</i>) or direct PDF link.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            {/* Version */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">CV Version Tag</label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="e.g. 2026.1"
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all"
              />
            </div>

            {/* Hiring Availability Status */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                <MdOutlineWorkOutline className="text-emerald-400" /> Availability Status
              </label>
              <select
                value={formData.isAvailableForHire ? "true" : "false"}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailableForHire: e.target.value === "true" })
                }
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all"
              >
                <option value="true">🟢 Open to Work / Available for Hire</option>
                <option value="false">🟡 Currently Busy / Freelance Only</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiSave className="text-lg" />
              <span>{isPending ? "Saving..." : "Save Resume Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeCMS;
