import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ContactCMS = () => {
  const [formData, setFormData] = useState({
    heading: "",
    email: "",
    phone: "",
    supportEmail: "",
    latitude: "",
    longitude: "",
  });

  // handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  // POST mutation
  const PostContactCMS = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("http://localhost:5000/api/contact-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact info");
      }

      return response.json();
    },

    // SUCCESS
    onSuccess: () => {
      toast.success("Contact Information Saved Successfully!");
      setFormData({
        heading: "",
        email: "",
        phone: "",
        supportEmail: "",
        latitude: "",
        longitude: "",
      });
    },

    // ERROR
    onError: () => {
      toast.error("Failed to save contact info!");
    },
  });

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.heading ||
      !formData.email ||
      !formData.phone ||
      !formData.supportEmail ||
      !formData.latitude ||
      !formData.longitude
    ) {
      toast.error("All fields are required!");
      return;
    }

    PostContactCMS.mutate({
      ...formData,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    });
  };

  return (
    <div className="p-6 max-w-3xl w-full mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Contact CMS Settings</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-5"
      >
        {/* Heading */}
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">Heading</label>
          <textarea
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            rows="3"
            placeholder="Enter heading..."
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email..."
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone..."
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-blue-500"
          />
        </div>

        {/* Support Email */}
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">
            Support Email
          </label>
          <input
            type="email"
            name="supportEmail"
            value={formData.supportEmail}
            onChange={handleChange}
            placeholder="Enter support email..."
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-blue-500"
          />
        </div>

        {/* Latitude */}
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">Latitude</label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="40.7128"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-blue-500"
          />
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-gray-300 mb-1 font-semibold">Longitude</label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="-74.0060"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={PostContactCMS.isPending}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
        >
          {PostContactCMS.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ContactCMS;
