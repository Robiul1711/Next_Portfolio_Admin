import CommonNavbar from "@/pages/admin/CommonNavbar";
import SideBar from "@/pages/admin/SideBar";

import React, { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
const AdminLayout = () => {
  const [Open, setOpen] = useState(false);

  const sideBar = [
    {
        id: 1,
        icon: <MdDashboard />,
        text: "Dashboard",
        path: "/dashboard", // main path (optional, if you still want to keep it)
        activePaths: ["/dashboard", "/dashboard/settings", "/dashboard/analytics"], // all paths that should make this item active
        sublink: false,
      }
      ,
    {
      id:2,
      icon:<MdDashboard />,
      text:"Projects Management",
      path:"/dashboard/all-project",
      sublink:[
        {
          id:1,
          text:"All Prjects",
          path:"/dashboard/all-project",
        },
        {
          id:1,
          text:"Add New Project",
          path:"/dashboard/add-project",
        },
      ]
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
      <div className="flex  h-screen min-h-screen w-full">
        <SideBar open={Open} setOpen={setOpen} sidebar={sideBar} />
        <div className="flex-1  bg-gradient-to-br from-gray-900 to-black text-white flex flex-col overflow-auto custom-scrollbar">
          <div className=" flex flex-col px-4">
            <CommonNavbar open={Open} setOpen={setOpen} />
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
