import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faBriefcase,
  faGear,
  faChartArea,
  faUserFriends,
  faChartColumn,
  faList,
  faQrcode,

} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faFolderClosed } from "@fortawesome/free-solid-svg-icons/faFolderClosed";

function AdminSidebar() {
  const [activeTab, setActiveTab] = useState(""); // Tracks the active tab

  const items = [
    // {
    //   item: "Users",
    //   icon: faUserCircle,
    //   for: "user-toggle",
    //   subitem: [
    //     { name: "All Users", link: "/users/all" },
    //   ],
    // },
    {
      item: "Staff Data",
      icon: faBriefcase,
      for: "datas-toggle",
      subitem: [
        { name: "All Datas", link: "/alldata" },
        { name: "Suspended", link: "/suspended" },
        { name: "Terminated", link: "/datas/terminated" },
      ],
    },

    
    {
      item: "Folder",
      icon: faFolderClosed,
      for: "educations-toggle",
      subitem: [
        { name: "All FIles", link: "/files" },
       
      ],
    },
    {
      item: "Inventry",
      icon: faChartArea,
      for: "certificate-toggle",
      subitem: [
        { name: "All Inventory", link: "/inventory" },
       
      ],
    },
    {
      item: "Expensis",
      icon: faChartColumn,
      for: "expensis-toggle",
      subitem: [
        { name: "All Expensis", link: "/expensis" },
       
      ],
    },

    {
      item: "Leave",
      icon: faList,
      for: "leave-toggle",
      subitem: [
        { name: "All Leave", link: "/leave" },
       
      ],
    },

    {
      item: "Customer",
      icon: faUserFriends,
      for: "customer-toggle",
      subitem: [
        { name: "All Customers", link: "/customer" },
       
      ],
    },

    {
      item: "QR-Code",
      icon: faQrcode,
      for: "qr-toggle",
      subitem: [
        { name: "Customers", link: "/custome" },
        { name: "Staff", link: "/custome" },
       
      ],
    },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="hidden peer-checked:flex md:flex flex-col w-64 bg-blue-800 h-full">
        <div className="flex items-center justify-between h-16 bg-blue-900 px-4">
          <span className="text-white font-bold uppercase">Sidebar</span>
          <label htmlFor="menu-toggle" className="text-white cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 lg:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </label>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-my-color">
            {items.map((item, index) => (
              <div key={index} className="mb-2 relative group">
                <input
                  type="checkbox"
                  id={item.for}
                  className="hidden peer"
                />
                <label
                  htmlFor={item.for}
                  className={`flex items-center px-4 py-2 ${
                    activeTab === item.item
                      ? "bg-blue-900 text-white"
                      : "text-gray-100 hover:bg-gray-700"
                  } cursor-pointer w-full`}
                  onClick={() => handleTabClick(item.item)}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="mr-2 text-white"
                  />
                  {item.item}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-auto transition-transform transform peer-checked:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </label>

                {/* Submenu */}
                <div className="hidden peer-checked:flex flex-col bg-gray-700 text-gray-200 mt-1 transition-all duration-300">
                  {item.subitem.map((sub, idx) => (
                    <Link
                      to={sub.link}
                      key={idx}
                      className={`block px-4 py-2 ${
                        activeTab === sub.name
                          ? "bg-gray-600 text-white"
                          : "hover:bg-gray-600"
                      }`}
                      onClick={() => handleTabClick(sub.name)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
