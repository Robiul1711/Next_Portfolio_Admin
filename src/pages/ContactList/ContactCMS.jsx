import React, { useState, useEffect } from "react";
import { useApiQuery } from "@/hooks/allCMS";
import { useApiMutation } from "@/hooks/postApi";
import { useQueryClient } from "@tanstack/react-query";
import {
  FiSettings,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
  FiCheckCircle,
  FiHelpCircle,
} from "react-icons/fi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const ContactCMS = () => {
  const [formData, setFormData] = useState({
    heading: "",
    email: "",
    phone: "",
    supportEmail: "",
    latitude: "",
    longitude: "",
  });

  const queryClient = useQueryClient();

  // Fetch current existing contact info
  const { data: existingInfo, isLoading } = useApiQuery({
    queryKey: "contact-info",
    url: "/api/contact-info",
    secure: true,
  });

  useEffect(() => {
    if (existingInfo) {
      setFormData({
        heading: existingInfo.heading || "",
        email: existingInfo.email || "",
        phone: existingInfo.phone || "",
        supportEmail: existingInfo.supportEmail || "",
        latitude: existingInfo.latitude || "",
        longitude: existingInfo.longitude || "",
      });
    }
  }, [existingInfo]);

  // Mutation to update contact info
  const { mutate: updateMutation, isPending } = useApiMutation({
    url: "/api/contact-info",
    defaultMethod: "put",
    secure: true,
    successMessage: "Contact information updated successfully!",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation(
      {
        method: "put",
        customUrl: "/api/contact-info",
        data: {
          ...formData,
          latitude: Number(formData.latitude) || 0,
          longitude: Number(formData.longitude) || 0,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["contact-info"]);
        },
      }
    );
  };

  return (
    <div className="space-y-6 pb-12 pt-2 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <MdOutlineAdminPanelSettings className="text-amber-400" />
          Contact Information CMS
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Customize your public contact information, phone numbers, email addresses, and map coordinates displayed on your portfolio website.
        </p>
      </div>

      {/* Main CMS Form Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Heading Text */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-white">
              Contact Section Heading / Pitch
            </label>
            <textarea
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              rows="3"
              placeholder="e.g. Let's discuss your next project or opportunity..."
              required
              className="w-full p-4 bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none transition-all resize-y"
            />
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Primary Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                <FiMail className="text-amber-400" /> Primary Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@gmail.com"
                required
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Support / Secondary Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                <FiMail className="text-amber-400" /> Support / Alternative Email
              </label>
              <input
                type="email"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                placeholder="support@domain.com"
                required
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white flex items-center gap-1.5">
                <FiPhone className="text-amber-400" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1XXXXXXXXX"
                required
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Location Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-white flex items-center gap-1">
                  <FiMapPin className="text-amber-400" /> Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="23.8103"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 rounded-xl px-3 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-white flex items-center gap-1">
                  <FiMapPin className="text-amber-400" /> Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="90.4125"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/60 rounded-xl px-3 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiSave className="text-lg" />
              <span>{isPending ? "Saving Changes..." : "Save Contact Info"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactCMS;
