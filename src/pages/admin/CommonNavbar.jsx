import React from "react";
import { IoIosNotifications } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiExternalLink, FiGlobe } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const CommonNavbar = ({ open, setOpen }) => {
  const { pathname } = useLocation();

  // Dynamic breadcrumb/page title mapping
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard Overview";
    if (pathname.includes("all-project")) return "All Projects";
    if (pathname.includes("add-project")) return "Add New Project";
    if (pathname.includes("skills")) return "Skills & Tech Stack CMS";
    if (pathname.includes("experiences")) return "Career Experience Timeline";
    if (pathname.includes("all-blogs")) return "All Blogs";
    if (pathname.includes("add-blogs")) return "Create New Blog";
    if (pathname.includes("all-contacts")) return "Client Contacts";
    if (pathname.includes("contact-cms")) return "Contact CMS";
    if (pathname.includes("resume")) return "Resume & CV Manager";
    return "Admin Workspace";
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full py-4 mb-6 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl transition-all px-4 sm:px-8">
      {/* Left: Mobile Toggle & Welcome Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle Navigation Sidebar"
        >
          <GiHamburgerMenu size={20} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Workspace
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400">{getPageTitle()}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Welcome Back Ashiq 👋
          </h2>
        </div>
      </div>

      {/* Right: Live Portfolio Link, Notifications & Profile Avatar */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Visit Live Portfolio Button */}
        <a
          href="https://robiul-islam-ashiq.netlify.app/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-cyan-400 border border-cyan-500/30 text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
          title="Visit Live Portfolio Website"
        >
          <FiGlobe className="text-base" />
          <span className="hidden sm:inline">Live Portfolio</span>
          <FiExternalLink size={13} />
        </a>

        {/* Notifications Icon with Indicator */}
        <Link
          to="/dashboard/all-contacts"
          className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
          title="View Client Contacts & Inquiries"
        >
          <IoIosNotifications size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
        </Link>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-white leading-tight">Ashiq</p>
            <p className="text-[11px] text-slate-400 font-medium">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CommonNavbar;
