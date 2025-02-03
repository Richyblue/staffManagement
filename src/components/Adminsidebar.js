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
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faFolderClosed } from "@fortawesome/free-solid-svg-icons/faFolderClosed";

function AdminSidebar() {
  const [activeTab, setActiveTab] = useState(""); // Tracks the active tab
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile menu state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const items = [
    {
      item: "Staff Data",
      icon: faBriefcase,
      for: "datas-toggle",
      subitem: [
        { name: "All Datas", link: "/alldata" },
        
      ],
    },
    {
      item: "Folder",
      icon: faFolderClosed,
      for: "folder-toggle",
      subitem: [{ name: "All Files", link: "/files" }],
    },
    {
      item: "Inventory",
      icon: faChartArea,
      for: "inventory-toggle",
      subitem: [{ name: "All Inventory", link: "/inventory" }],
    },
    {
      item: "Expenses",
      icon: faChartColumn,
      for: "expenses-toggle",
      subitem: [{ name: "All Expenses", link: "/expenses" }],
    },
    {
      item: "Leave",
      icon: faList,
      for: "leave-toggle",
      subitem: [{ name: "All Leave", link: "/leave" }],
    },
    {
      item: "Customer",
      icon: faUserFriends,
      for: "customer-toggle",
      subitem: [{ name: "All Customers", link: "/customer" }],
    },
    {
      item: "QR-Code",
      icon: faQrcode,
      for: "qr-toggle",
      subitem: [
        { name: "Settings", link: "/qrcode" },
  
      ],
    },
  ];

  return (
    <div className="h-screen flex">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden text-white p-4 bg-blue-800 fixed top-0 left-0 z-50"
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} size="lg" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative bg-blue-800 h-full w-64 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 bg-blue-900 px-4">
          <span className="text-white font-bold uppercase">Sidebar</span>
          <button
            className="md:hidden text-white"
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4">
            {items.map((item, index) => (
              <div key={index} className="mb-2">
                <input
                  type="checkbox"
                  id={item.for}
                  className="hidden peer"
                />
                <label
                  htmlFor={item.for}
                  className={`flex items-center px-4 py-2 text-gray-100 cursor-pointer ${
                    activeTab === item.item ? "bg-blue-900 text-white" : "hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab(item.item)}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-2 text-white" />
                  {item.item}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-auto transition-transform transform peer-checked:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </label>

                {/* Submenu */}
                <div className="hidden peer-checked:flex flex-col bg-gray-700 text-gray-200 mt-1">
                  {item.subitem.map((sub, idx) => (
                    <Link
                      to={sub.link}
                      key={idx}
                      className={`block px-4 py-2 ${
                        activeTab === sub.name ? "bg-gray-600 text-white" : "hover:bg-gray-600"
                      }`}
                      onClick={() => setActiveTab(sub.name)}
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
