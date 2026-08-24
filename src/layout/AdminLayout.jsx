import CommonNavbar from "@/pages/admin/CommonNavbar";
import SideBar from "@/pages/admin/SideBar";
import React, { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import { FaBlog } from "react-icons/fa6";
import { FiFolderPlus, FiFileText, FiMail, FiBriefcase, FiLayers } from "react-icons/fi";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sideBar = [
    {
      id: 1,
      icon: <MdDashboard size={20} />,
      text: "Dashboard",
      path: "/dashboard",
      activePaths: ["/dashboard"],
      sublink: false,
    },
    {
      id: 2,
      icon: <FiFolderPlus size={20} />,
      text: "Projects Management",
      path: "/dashboard/all-project",
      sublink: [
        {
          id: 1,
          text: "All Projects",
          path: "/dashboard/all-project",
        },
        {
          id: 2,
          text: "Add New Project",
          path: "/dashboard/add-project",
        },
      ],
    },
    {
      id: 3,
      icon: <MdDashboard size={20} />,
      text: "Skills & Tech CMS",
      path: "/dashboard/skills",
      activePaths: ["/dashboard/skills"],
      sublink: false,
    },
    {
      id: 4,
      icon: <FiBriefcase size={19} />,
      text: "Experience Timeline",
      path: "/dashboard/experiences",
      activePaths: ["/dashboard/experiences"],
      sublink: false,
    },
    {
      id: 5,
      icon: <FaBlog size={18} />,
      text: "Blog Management",
      path: "/dashboard/all-blogs",
      sublink: [
        {
          id: 1,
          text: "All Articles",
          path: "/dashboard/all-blogs",
        },
        {
          id: 2,
          text: "AI Blog Generator",
          path: "/dashboard/add-blogs",
        },
      ],
    },
    {
      id: 6,
      icon: <RiContactsFill size={19} />,
      text: "Contact Management",
      path: "/dashboard/all-contacts",
      sublink: [
        {
          id: 1,
          text: "All Inquiries",
          path: "/dashboard/all-contacts",
        },
        {
          id: 2,
          text: "Contact Info CMS",
          path: "/dashboard/contact-cms",
        },
      ],
    },
    {
      id: 7,
      icon: <FiFileText size={18} />,
      text: "Resume / CV CMS",
      path: "/dashboard/resume",
      activePaths: ["/dashboard/resume"],
      sublink: false,
    },
  ];

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  return (
    <>
      <ScrollRestoration />
      <div className="flex h-screen min-h-screen w-full bg-slate-950 text-white overflow-hidden">
        {/* Sidebar */}
        <SideBar
          open={open}
          setOpen={setOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebar={sideBar}
        />

        {/* Main Content Area */}
        <div className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex flex-col overflow-auto custom-scrollbar transition-all duration-300">
          <div className="flex flex-col  ">
            <CommonNavbar
              open={open}
              setOpen={setOpen}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
            <main className="flex-1 pb-10 px-4 sm:px-8">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
