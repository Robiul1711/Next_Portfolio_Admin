import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import logo from "../../assets/images/logo3.svg";

const SideBar = ({ sidebar, open, setOpen, collapsed, setCollapsed }) => {
  const location = useLocation();
  const [activeParentIndex, setActiveParentIndex] = useState(null);

  useEffect(() => {
    sidebar.forEach((item, index) => {
      if (item.sublink) {
        const activeSub = item.sublink.find(
          (sub) => sub.path === location.pathname
        );
        if (activeSub) {
          setActiveParentIndex(index);
        }
      }
    });
  }, [location.pathname, sidebar]);

  const isActive = (paths) => {
    if (!paths) return false;
    const pathArray = Array.isArray(paths) ? paths : [paths];
    return pathArray.includes(location.pathname);
  };

  const isParentActive = (item) => {
    if (!item.sublink) return isActive(item.path);
    return item.sublink.some((sub) => isActive(sub.path));
  };

  const toggleSubmenu = (index) => {
    if (collapsed) {
      setCollapsed(false);
      setActiveParentIndex(index);
    } else {
      setActiveParentIndex((prev) => (prev === index ? null : index));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 ${
          open ? "opacity-100 visible z-40" : "opacity-0 invisible pointer-events-none"
        } lg:hidden`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar Container */}
      <aside
        className={`h-full py-6 bg-slate-950/95 border-r border-slate-800 text-white backdrop-blur-xl flex flex-col justify-between shadow-2xl transition-all duration-300 fixed lg:static z-50
        ${open ? "left-0 top-0 w-[280px]" : "-left-full lg:left-0"}
        ${collapsed ? "lg:w-[84px] lg:px-3" : "lg:w-[280px] lg:px-5 px-5"}
        `}
      >
        <div className="flex flex-col gap-6">
          {/* Logo & Desktop Collapse Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 min-h-[52px]">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 overflow-hidden transition-all ${
                collapsed ? "justify-center w-full" : ""
              }`}
            >
              {collapsed ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  A
                </div>
              ) : (
                <img src={logo} alt="Portfolio Logo" className="w-32 md:w-36 object-contain" />
              )}
            </Link>

            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {sidebar?.map((item, index) => {
              const parentActive = isParentActive(item);

              return !item?.sublink ? (
                // --- Single Route Link ---
                <Link
                  key={index}
                  to={item?.path}
                  onClick={() => {
                    setActiveParentIndex(null);
                    setOpen(false);
                  }}
                  title={collapsed ? item?.text : ""}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative
                  ${
                    isActive(item?.activePaths)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                  }
                  ${collapsed ? "justify-center px-0" : ""}
                  `}
                >
                  <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">
                    {item?.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item?.text}</span>}
                </Link>
              ) : (
                // --- Dropdown Parent Menu ---
                <div className="relative" key={index}>
                  <div
                    onClick={() => toggleSubmenu(index)}
                    title={collapsed ? item?.text : ""}
                    className={`flex items-center justify-between px-3.5 py-3 cursor-pointer rounded-xl text-sm font-semibold transition-all duration-200 group
                    ${
                      parentActive
                        ? "bg-slate-900 text-blue-400 border border-slate-800"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                    }
                    ${collapsed ? "justify-center px-0" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">
                        {item?.icon}
                      </span>
                      {!collapsed && <span className="truncate">{item?.text}</span>}
                    </div>

                    {!collapsed && (
                      <span
                        className={`transform transition-transform duration-300 text-slate-400 ${
                          activeParentIndex === index ? "rotate-180 text-white" : "rotate-0"
                        }`}
                      >
                        <MdKeyboardArrowDown size={18} />
                      </span>
                    )}
                  </div>

                  {/* Sublinks */}
                  {!collapsed && (
                    <div
                      className={`transition-all duration-300 overflow-hidden rounded-xl bg-slate-950/60 border-l-2 border-blue-500/40 ml-4 mt-1.5 space-y-1 ${
                        activeParentIndex === index
                          ? "max-h-[300px] py-1.5 pl-3 opacity-100"
                          : "max-h-0 opacity-0 py-0"
                      }`}
                    >
                      {item?.sublink?.map((sub, subIdx) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={subIdx}
                            to={sub.path}
                            onClick={() => setOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              isSubActive
                                ? "bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30"
                                : "text-slate-400 hover:bg-slate-900 hover:text-white"
                            }`}
                          >
                            {sub.text}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Logout Action */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            title={collapsed ? "Log Out" : ""}
            className={`w-full flex items-center gap-3 px-3.5 py-3 cursor-pointer rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:bg-rose-600 hover:border-rose-500 hover:text-white transition-all text-xs font-semibold group shadow-sm active:scale-95
            ${collapsed ? "justify-center px-0" : ""}
            `}
          >
            <IoLogOutOutline size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
