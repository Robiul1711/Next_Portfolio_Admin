import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import logo from "../../assets/images/logo3.svg";

const SideBar = ({ sidebar, open, setOpen }) => {
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
    setActiveParentIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-gray-900 to-black transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        } xl:hidden z-50`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`h-full py-6 ${
          open
            ? "left-0 top-0 w-[320px] z-[220]"
            : "-left-full xl:left-0 xl:w-[350px] w-[320px]"
        }
        bg-gradient-to-br from-gray-900 to-black border-r border-gray-700 text-white backdrop-blur-md lg:px-8 px-4 flex flex-col gap-8 
        shadow-xl fixed xl:static transition-all duration-300`}
      >
        {/* Logo */}
        <Link to={"/dashboard"}>
          <div className="flex justify-center items-center mb-6">
            <img src={logo} alt="" className="w-32 md:w-44" />
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex flex-col gap-3">
          {sidebar?.map((item, index) => {
            const parentActive = isParentActive(item);

            return !item?.sublink ? (
              // --- Single Link ---
              <Link
                key={index}
                to={item?.path}
                onClick={() => {
                  setActiveParentIndex(null);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium
                transition-colors duration-200 ${
                  isActive(item?.activePaths)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-[#1E1E1E] hover:text-white"
                }`}
              >
                <span className="text-lg text-white">{item?.icon}</span>
                {item?.text}
              </Link>
            ) : (
              // --- Dropdown Parent ---
              <div className="relative" key={index}>
                <div
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-lg 
                  transition-colors duration-200 ${
                    parentActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-[#1E1E1E] hover:text-white"
                  }`}
                  onClick={() => toggleSubmenu(index)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-white">{item?.icon}</span>
                    <p className="font-medium">{item?.text}</p>
                  </div>

                  <span
                    className={`transform transition-transform duration-300 ${
                      activeParentIndex === index ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <MdKeyboardArrowDown size={20} />
                  </span>
                </div>

                {/* Sublinks */}
                <div
                  className={`transition-all duration-300 overflow-hidden px-3 rounded-lg bg-[#1A1A1A] ${
                    activeParentIndex === index
                      ? "max-h-[500px] py-3 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    {item?.sublink?.map((value, subIndex) => (
                      <Link
                        key={subIndex}
                        to={value?.path}
                        onClick={() => setOpen(false)}
                        className={`block px-4 py-2 rounded-md transition-colors duration-200 ${
                          location.pathname === value.path
                            ? "bg-blue-500 text-white"
                            : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                        }`}
                      >
                        {value?.text}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Logout */}
          <div className="absolute bottom-6 w-[80%] flex items-center gap-3 px-4 py-2 cursor-pointer rounded-lg 
            bg-[#1E1E1E] text-gray-300 hover:bg-red-600 hover:text-white transition-all">
            <IoLogOutOutline size={22} />
            <p className="font-medium">Log Out</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
