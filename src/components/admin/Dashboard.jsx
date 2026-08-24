import React from "react";
import { Link } from "react-router-dom";
import { useApiQuery } from "@/hooks/allCMS";
import {
  FiFolder,
  FiFileText,
  FiMail,
  FiLayers,
  FiPlus,
  FiArrowUpRight,
  FiExternalLink,
  FiGithub,
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { MdAutoAwesome, MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa6";

const Dashboard = () => {
  // Fetch dynamic real-time stats from backend
  const {
    data: dashboardData,
    isLoading,
    isRefetching,
    refetch,
  } = useApiQuery({
    queryKey: "dashboard-stats",
    url: "/api/dashboard/stats",
    secure: true,
  });

  const stats = dashboardData?.stats || {
    totalProjects: 0,
    popularProjects: 0,
    totalBlogs: 0,
    totalContacts: 0,
    uniqueTechnologiesCount: 0,
  };

  const recent = dashboardData?.recent || {
    projects: [],
    blogs: [],
    contacts: [],
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const metricCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      subtitle: `${stats.popularProjects} Featured / Popular`,
      icon: <FiFolder className="text-2xl text-blue-400" />,
      bgGradient: "from-blue-600/20 via-blue-500/10 to-transparent",
      borderColor: "border-blue-500/20 hover:border-blue-500/50",
      accentBg: "bg-blue-500/10 text-blue-400",
      path: "/dashboard/all-project",
      linkText: "View Projects",
    },
    {
      title: "Blog Articles",
      value: stats.totalBlogs,
      subtitle: "Published Tech & AI Posts",
      icon: <FiFileText className="text-2xl text-purple-400" />,
      bgGradient: "from-purple-600/20 via-purple-500/10 to-transparent",
      borderColor: "border-purple-500/20 hover:border-purple-500/50",
      accentBg: "bg-purple-500/10 text-purple-400",
      path: "/dashboard/all-blogs",
      linkText: "Manage Blogs",
    },
    {
      title: "Client Messages",
      value: stats.totalContacts,
      subtitle: "Contact form inquiries",
      icon: <FiMail className="text-2xl text-emerald-400" />,
      bgGradient: "from-emerald-600/20 via-emerald-500/10 to-transparent",
      borderColor: "border-emerald-500/20 hover:border-emerald-500/50",
      accentBg: "bg-emerald-500/10 text-emerald-400",
      path: "/dashboard/all-contacts",
      linkText: "Read Inquiries",
    },
    {
      title: "Tech Stacks & Skills",
      value: stats.uniqueTechnologiesCount || "12+",
      subtitle: "Integrated across projects",
      icon: <FiLayers className="text-2xl text-amber-400" />,
      bgGradient: "from-amber-600/20 via-amber-500/10 to-transparent",
      borderColor: "border-amber-500/20 hover:border-amber-500/50",
      accentBg: "bg-amber-500/10 text-amber-400",
      path: "/dashboard/all-project",
      linkText: "Explore Stacks",
    },
  ];

  const quickActions = [
    {
      title: "Add New Project",
      desc: "Upload portfolio showcase with GitHub & Live links",
      icon: <FiPlus className="text-xl" />,
      path: "/dashboard/add-project",
      color: "from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500",
    },
    {
      title: "Create Blog Post",
      desc: "Draft manual or AI-assisted tech articles",
      icon: <MdAutoAwesome className="text-xl" />,
      path: "/dashboard/add-blogs",
      color: "from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
    },
    {
      title: "View Inquiries",
      desc: "Review feedback & hire requests from visitors",
      icon: <FiMail className="text-xl" />,
      path: "/dashboard/all-contacts",
      color: "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
    },
    {
      title: "Contact Info CMS",
      desc: "Update personal contact details & social channels",
      icon: <MdOutlineAdminPanelSettings className="text-xl" />,
      path: "/dashboard/contact-cms",
      color: "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500",
    },
  ];

  return (
    <div className="space-y-8 pb-12 pt-2">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-purple-950/50 border border-slate-800 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live System Operational
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <FiClock className="text-slate-500" /> {formattedDate}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Admin Workspace Overview
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl">
              Monitor your projects, blog posts, contact inquiries, and system health in real-time from a single centralized hub.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-sm font-medium border border-slate-700/60 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Refresh Dashboard Data"
            >
              <FiRefreshCw className={`text-base ${isRefetching ? "animate-spin text-blue-400" : ""}`} />
              <span>{isRefetching ? "Syncing..." : "Sync Stats"}</span>
            </button>

            <Link
              to="/dashboard/add-project"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <FiPlus className="text-lg" />
              <span>Add Project</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card, idx) => (
          <div
            key={idx}
            className={`relative group overflow-hidden rounded-2xl bg-gradient-to-b ${card.bgGradient} bg-slate-900/60 border ${card.borderColor} p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="text-3xl font-black text-white tracking-tight">
                  {isLoading ? (
                    <div className="h-9 w-16 bg-slate-800 animate-pulse rounded-md" />
                  ) : (
                    card.value
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-xl ${card.accentBg} transition-transform group-hover:scale-110`}>
                {card.icon}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 truncate max-w-[150px]">
                {card.subtitle}
              </span>
              <Link
                to={card.path}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:underline"
              >
                {card.linkText}
                <FiArrowUpRight className="text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Hub */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FaLaptopCode className="text-blue-400" />
            Quick Management Hub
          </h2>
          <span className="text-xs text-slate-400">Shortcuts to common operations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.path}
              className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900/80 hover:shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center shadow-md`}
                >
                  {action.icon}
                </div>
                <h3 className="font-semibold text-white text-base group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {action.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Recent Messages & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Contact Messages (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/50 border border-slate-800/90 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FiMail className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Recent Inquiries</h3>
                  <p className="text-xs text-slate-400">Latest messages submitted via portfolio</p>
                </div>
              </div>
              <Link
                to="/dashboard/all-contacts"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all hover:bg-emerald-500/20"
              >
                View All <FiArrowUpRight />
              </Link>
            </div>

            {/* List */}
            <div className="mt-4 divide-y divide-slate-800/60">
              {isLoading ? (
                <div className="space-y-4 py-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-16 bg-slate-800/40 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : recent.contacts?.length > 0 ? (
                recent.contacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-800/30 px-3 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                        {contact.name ? contact.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                            {contact.name}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            &lt;{contact.email}&gt;
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
                          {contact.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 self-end sm:self-center">
                      <span>
                        {contact.createdAt
                          ? new Date(contact.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "Recent"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <FiMail className="mx-auto text-4xl mb-3 opacity-40 text-slate-400" />
                  <p className="text-sm">No inquiries received yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Total Messages: {stats.totalContacts}</span>
            <Link to="/dashboard/contact-cms" className="hover:text-slate-200 underline">
              Customize Form CMS
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Projects (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/50 border border-slate-800/90 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FiFolder className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Latest Projects</h3>
                  <p className="text-xs text-slate-400">Recently created works</p>
                </div>
              </div>
              <Link
                to="/dashboard/all-project"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all hover:bg-blue-500/20"
              >
                All Projects <FiArrowUpRight />
              </Link>
            </div>

            {/* List */}
            <div className="mt-4 space-y-3.5">
              {isLoading ? (
                <div className="space-y-3 py-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-16 bg-slate-800/40 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : recent.projects?.length > 0 ? (
                recent.projects.map((project) => (
                  <div
                    key={project._id}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 flex items-center gap-3.5 transition-all group"
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                        <FiFolder />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </h4>
                        {project.popular && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-medium shrink-0">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        Stack: {project.stack || "Full Stack"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          title="GitHub Repository"
                        >
                          <FiGithub size={14} />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                          title="Live Preview"
                        >
                          <FiExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <FiFolder className="mx-auto text-4xl mb-3 opacity-40 text-slate-400" />
                  <p className="text-sm">No projects added yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <Link
              to="/dashboard/add-project"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700/60 transition-colors"
            >
              <FiPlus /> Add Another Project
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Blogs & System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Blogs Showcase */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/50 border border-slate-800/90 p-6 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <FiFileText className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Recent Articles</h3>
                <p className="text-xs text-slate-400">Published portfolio blog posts</p>
              </div>
            </div>
            <Link
              to="/dashboard/all-blogs"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 transition-all hover:bg-purple-500/20"
            >
              All Blogs <FiArrowUpRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {isLoading ? (
              [1, 2].map((n) => (
                <div key={n} className="h-28 bg-slate-800/40 animate-pulse rounded-xl" />
              ))
            ) : recent.blogs?.length > 0 ? (
              recent.blogs.slice(0, 4).map((blog) => (
                <div
                  key={blog._id}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-purple-500/30 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md">
                        {blog.tag || "Technology"}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {blog.readTime || "3 min read"}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5">
                      {blog.excerpt || blog.description || "No excerpt available."}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{blog.date || "Recently"}</span>
                    <span className="text-purple-400 group-hover:underline flex items-center gap-0.5">
                      Read <FiArrowUpRight />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-10 text-center text-slate-500">
                <FiFileText className="mx-auto text-4xl mb-2 opacity-40 text-slate-400" />
                <p className="text-sm">No blog posts published yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* System Architecture & Info Box */}
        <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800/90 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <FiActivity className="text-blue-400" /> System Status
            </h3>
            <p className="text-xs text-slate-400 mb-5">Portfolio ecosystem environment</p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-400">Database</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> MongoDB Atlas
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-400">Server Status</span>
                <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                  <FiCheckCircle /> Online (Active)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-400">Security</span>
                <span className="text-purple-400 font-semibold">JWT + Bearer Auth</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] text-slate-500 text-center">
              Personal Portfolio Admin Dashboard v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;