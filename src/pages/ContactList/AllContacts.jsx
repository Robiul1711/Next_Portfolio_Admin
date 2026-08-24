import React, { useState, useMemo } from "react";
import { useApiQuery } from "@/hooks/allCMS";
import { useApiMutation } from "@/hooks/postApi";
import { useQueryClient } from "@tanstack/react-query";
import {
  FiTrash2,
  FiDownload,
  FiMail,
  FiSearch,
  FiClock,
  FiMapPin,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiAlertTriangle,
} from "react-icons/fi";

const AllContacts = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const queryClient = useQueryClient();

  // Fetch all contact messages
  const { data: allContact, isLoading } = useApiQuery({
    queryKey: "all-contact",
    url: "/api/contact",
    secure: true,
  });

  // Delete mutation
  const { mutate: apiMutate, isPending: isDeleting } = useApiMutation({
    secure: true,
    successMessage: "Contact message deleted successfully!",
  });

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    apiMutate(
      { method: "delete", customUrl: `/api/contact/${selectedId}` },
      {
        onSuccess: () => {
          setShowModal(false);
          setSelectedId(null);
          queryClient.invalidateQueries(["all-contact"]);
          queryClient.invalidateQueries(["dashboard-stats"]);
        },
      }
    );
  };

  // Filter messages based on search query
  const filteredContacts = useMemo(() => {
    if (!allContact || !Array.isArray(allContact)) return [];
    if (!searchQuery.trim()) return allContact;
    const query = searchQuery.toLowerCase();
    return allContact.filter(
      (c) =>
        c?.name?.toLowerCase().includes(query) ||
        c?.email?.toLowerCase().includes(query) ||
        c?.address?.toLowerCase().includes(query) ||
        c?.message?.toLowerCase().includes(query)
    );
  }, [allContact, searchQuery]);

  // Export to CSV functionality
  const handleExportCSV = () => {
    if (!allContact || allContact.length === 0) return;

    // CSV Header row
    const headers = ["Name", "Email", "Address", "Message", "Received Date"];

    // Format rows with quotes for escaping commas and line breaks
    const rows = allContact.map((c) => {
      const escape = (text) => `"${(text || "").toString().replace(/"/g, '""')}"`;
      const date = c.createdAt
        ? new Date(c.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      return [
        escape(c.name),
        escape(c.email),
        escape(c.address),
        escape(c.message),
        escape(date),
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `portfolio_inquiries_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy email to clipboard
  const handleCopyEmail = (email, id) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FiMail className="text-emerald-400" />
            Client Inquiries & Contacts
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Total {allContact?.length || 0} messages received through the portfolio contact form.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={!allContact || allContact.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Download CSV Spreadsheet"
          >
            <FiDownload className="text-base" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by sender name, email, address, or message keyword..."
          className="w-full bg-slate-900/70 border border-slate-800 focus:border-emerald-500/50 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Contact Cards List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4 py-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-slate-800/40 animate-pulse rounded-2xl border border-slate-800" />
            ))}
          </div>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className="group bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl backdrop-blur-md transition-all duration-200 hover:shadow-xl relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Avatar & Contact Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                    {contact.name ? contact.name.charAt(0).toUpperCase() : "U"}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {contact.name || "Anonymous Sender"}
                      </h2>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <FiClock size={12} />
                        {contact.createdAt
                          ? new Date(contact.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Recently"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="text-emerald-400 font-medium">{contact.email}</span>

                      {contact.address && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <FiMapPin size={12} className="text-slate-500" /> {contact.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                  <button
                    onClick={() => handleCopyEmail(contact.email, contact._id)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy Email Address"
                  >
                    {copiedId === contact._id ? (
                      <>
                        <FiCheck className="text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${contact.email}`}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700/50 text-xs transition-colors flex items-center gap-1"
                    title="Reply via Email Client"
                  >
                    <FiExternalLink />
                    <span>Reply</span>
                  </a>

                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    title="Delete Message"
                  >
                    <FiTrash2 />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 font-sans">
                  {contact.message || "No message content."}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <FiMail className="mx-auto text-5xl mb-3 text-slate-600" />
            <h3 className="text-base font-semibold text-slate-300">No contact messages found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No results matching "${searchQuery}". Try a different keyword.`
                : "New visitor messages submitted on the portfolio contact form will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
                <FiAlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Contact Message</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              Are you sure you want to permanently delete this client inquiry?
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

export default AllContacts;
