import React, { useContext } from "react";
import { storeContext } from "../context/storeContext";
import { Link } from "react-router-dom";

// You might want to install and use react-icons for these.
// For example: `npm install react-icons` and then import { FaBox, FaClipboardList, FaUpload } from 'react-icons/fa';
// For this example, I'll use simple SVG placeholders.

function ManagerDashboard() {
  const { fullName, APP_NAME, isAdmin, isManager } = useContext(storeContext);

  // Define dashboard navigation items
  const dashboardItems = [
    {
      name: "Go to Shop",
      description: "Shop existing products in your inventory.",
      icon: (
        <svg
          className="w-8 h-8 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          ></path>
        </svg>
      ),
      link: "/shop",
    },
    {
      name: "Manage Orders",
      description:
        "Track and update customer orders, from pending to delivered.",
      icon: (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          ></path>
        </svg>
      ),
      link: isAdmin ? "/admin/manage-orders" : "/manager/manage-orders",
    },
    // You can add more dashboard items here
    // {
    //   name: 'Manage Users',
    //   description: 'Handle user accounts and roles.',
    //   icon: (
    //     <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354c.334-.334.668-.334 1 0l2.5 2.5a.75.75 0 001.06 0l2.5-2.5c.334-.334.668-.334 1 0 .334.334.334.668 0 1L19.06 7.5l2.5 2.5a.75.75 0 000 1.06l-2.5 2.5-.75-.75zm-6 0c-.334-.334-.668-.334-1 0L2.5 6.854a.75.75 0 000 1.06l2.5 2.5c.334.334.668.334 1 0 .334-.334.334-.668 0-1L4.94 7.5l2.5-2.5a.75.75 0 000-1.06zM12 12a3 3 0 11-6 0 3 3 0 016 0zm-3 4a7 7 0 00-6 0v1a3 3 0 003 3h6a3 3 0 003-3v-1a7 7 0 00-6 0z"></path>
    //     </svg>
    //   ),
    //   link: '/admin/manage-users',
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Welcome, Manager {fullName}!
          </h1>
          <p className="text-lg text-gray-600">
            What would you like to do today in your{" "}
            <span className="font-semibold text-indigo-700">{APP_NAME}</span>{" "}
            Dashboard?
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-200 hover:border-indigo-400 cursor-pointer"
            >
              <div className="mb-4">{item.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {item.name}
              </h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
