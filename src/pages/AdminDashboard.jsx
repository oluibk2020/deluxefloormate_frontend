import React, { useContext, useState, useMemo } from "react";
import { storeContext } from "../context/storeContext";
import { Link } from "react-router-dom";
import { FaUsersCog } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
// --- Import Recharts components ---
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AdminDashboard() {
  const { fullName, APP_NAME, orderList, isManager, isAdmin } =
    useContext(storeContext);

  // --- Helper: Check if a date is today ---
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date.toDateString() === now.toDateString();
  };

  // Helper function to check if a date is within the current week (Sunday to Saturday)
  const isWithinCurrentWeek = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Set 'now' to the start of the current day (Sunday)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    // Set 'endOfWeek' to the end of Saturday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  };

  // Helper function to check if a date is within the current month
  const isWithinCurrentMonth = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  // --- NEW: Helper function to check if a date is within the last N months ---
  const isWithinLastNMonths = (dateString, months) => {
    const date = new Date(dateString);
    const now = new Date();

    // Calculate the cutoff date
    const cutoffDate = new Date();
    cutoffDate.setMonth(now.getMonth() - months);
    // Set cutoff to the beginning of that day
    cutoffDate.setHours(0, 0, 0, 0);

    // Ensure 'now' is set to the end of the current day
    now.setHours(23, 59, 59, 999);

    return date >= cutoffDate && date <= now;
  };

  // --- NEW: Specific helpers for 6 and 12 months ---
  const isWithinLast6Months = (dateString) => {
    return isWithinLastNMonths(dateString, 6);
  };

  const isWithinLast12Months = (dateString) => {
    return isWithinLastNMonths(dateString, 12);
  };

  // Helper (existing): Check if a date is within the current calendar year
  const isWithinCurrentYear = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date.getFullYear() === now.getFullYear();
  };

  // --- UPDATED metrics calculation ---
  const metrics = useMemo(() => {
    const orders = orderList.orders || [];
    const customerIds = new Set();
    const D_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // --- Initialize metrics ---
    let totalPendingOrders = 0;
    let totalSuccessfulOrders = 0;
    let totalFailedOrders = 0;
    let totalSuccessfulOrdersLast12Months = 0;

    let successfulSalesToday = 0;
    let successfulSalesWeek = 0;
    let successfulSalesMonth = 0;
    let successfulSalesLast6Months = 0; // New
    let successfulSalesLast12Months = 0; // New

    let profitToday = 0;
    let profitWeek = 0;
    let profitMonth = 0;
    let profitLast6Months = 0; // New
    let profitLast12Months = 0; // New

    let lostValueFailedOrders = 0;
    let pendingValueWeek = 0;

    // --- Initialize data for 7-day chart ---
    const salesChartData = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = D_NAMES[date.getDay()];
      // Store date in 'YYYY-MM-DD' format for easy matching
      const isoDate = date.toISOString().split("T")[0];
      salesChartData.push({
        name: dayName,
        date: isoDate,
        revenue: 0,
        profit: 0,
      });
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      customerIds.add(order.userId); // Track unique customers

      // --- *** NEW REVENUE & PROFIT LOGIC *** ---
      // Revenue = totalAmount (selling price) - discountAmount
      const orderRevenue = order.totalAmount - order.discountAmount;

      // Calculate Total Cost
      const totalCostPrice = (order.orderItems || []).reduce(
        (acc, item) => acc + item.costPrice * item.quantity,
        0
      );

      // Profit = Revenue - Total Cost
      const orderProfit = orderRevenue - totalCostPrice;
      // --- *** END OF NEW LOGIC *** ---

      // --- Order status counts (all-time) ---
      if (order.transactionStatus === "pending") {
        totalPendingOrders++;
      } else if (order.transactionStatus === "success") {
        totalSuccessfulOrders++;
      } else if (order.transactionStatus === "failed") {
        totalFailedOrders++;
      }

      // --- Successful sales value & profit ---
      if (order.transactionStatus === "success") {
        // Find matching day in chart data
        const orderDateStr = orderDate.toISOString().split("T")[0];
        const chartEntry = salesChartData.find((d) => d.date === orderDateStr);
        if (chartEntry) {
          chartEntry.revenue += orderRevenue; // UPDATED
          chartEntry.profit += orderProfit;
        }

        // Today
        if (isToday(orderDate)) {
          successfulSalesToday += orderRevenue; // UPDATED
          profitToday += orderProfit;
        }
        // Week
        if (isWithinCurrentWeek(orderDate)) {
          successfulSalesWeek += orderRevenue; // UPDATED
          profitWeek += orderProfit;
        }
        // Month
        if (isWithinCurrentMonth(orderDate)) {
          successfulSalesMonth += orderRevenue; // UPDATED
          profitMonth += orderProfit;
        }

        // --- NEW: Last 6 Months (Rolling) ---
        if (isWithinLast6Months(orderDate)) {
          successfulSalesLast6Months += orderRevenue; // UPDATED
          profitLast6Months += orderProfit;
        }

        // --- NEW: Last 12 Months (Rolling) ---
        if (isWithinLast12Months(orderDate)) {
          totalSuccessfulOrdersLast12Months++;
          successfulSalesLast12Months += orderRevenue; // UPDATED
          profitLast12Months += orderProfit;
        }
      }

      // --- Lost & Pending values ---
      // Use the new 'orderRevenue' calculation here as well
      if (order.transactionStatus === "failed") {
        lostValueFailedOrders += orderRevenue; // UPDATED
      }
      if (
        order.transactionStatus === "pending" &&
        isWithinCurrentWeek(orderDate)
      ) {
        pendingValueWeek += orderRevenue; // UPDATED
      }
    });

    // --- Data for Pie Chart ---
    const pieChartData = [
      { name: "Successful", value: totalSuccessfulOrders, fill: "#10B981" }, // green
      { name: "Pending", value: totalPendingOrders, fill: "#3B82F6" }, // blue
      { name: "Failed", value: totalFailedOrders, fill: "#EF4444" }, // red
    ];

    // --- Final calculations ---
    const totalCustomers = customerIds.size;

    // Updated AOV to use Last 12 Months
    const averageOrderValueLast12Months =
      totalSuccessfulOrdersLast12Months > 0
        ? successfulSalesLast12Months / totalSuccessfulOrdersLast12Months
        : 0;

    return {
      totalPendingOrders,
      totalSuccessfulOrders,
      totalFailedOrders,
      successfulSalesToday,
      successfulSalesWeek,
      successfulSalesMonth,
      successfulSalesLast6Months, // Return new metric
      successfulSalesLast12Months, // Return new metric
      profitToday,
      profitWeek,
      profitMonth,
      profitLast6Months, // Return new metric
      profitLast12Months, // Return new metric
      lostValueFailedOrders,
      pendingValueWeek,
      // New metrics
      salesChartData: salesChartData.map((d) => ({ ...d, date: undefined })),
      pieChartData,
      totalCustomers,
      averageOrderValueLast12Months, // Return L12M AOV
    };
  }, [orderList.orders]);

  // Dashboard navigation items (unchanged)
  const dashboardItems = [
    isAdmin && {
      name: "Manage Products",
      description: "View, edit, or delete existing products in your inventory.",
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
      link: "/admin/manage-products",
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
      link: isManager ? "/manager/manage-orders" : "/admin/manage-orders",
    },
    isAdmin && {
      name: "Upload Product",
      description: "Add new products to your store inventory.",
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          ></path>
        </svg>
      ),
      link: "/admin/product-upload",
    },
    {
      name: "Go to Shop",
      description: "Shop existing products in your inventory.",
      icon: <FaShop className="w-8 h-8 text-indigo-600" />,
      link: "/shop",
    },
    {
      name: "Manage User Roles",
      description: "Manage user roles and permissions.",
      icon: <FaUsersCog className="w-8 h-8 text-indigo-600" />,
      link: "/admin/manage-roles",
    },
  ];

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `₦${Number(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Helper for Pie Chart labels
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    if (percent === 0) return null; // Don't render label for 0%
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Welcome, {isManager ? "Manager" : "Admin"} {fullName}!
          </h1>
          <p className="text-lg text-gray-600">
            Here's an overview of your store's performance.
          </p>
        </div>

        {isAdmin && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center">
                📊 Store Performance Overview
              </h2>
              {/* Changed to 4-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* --- Card 1: Order Status Counts (with Pie Chart) --- */}
                <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Order Status
                  </h3>
                  <div style={{ width: "100%", height: 150 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={metrics.pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {metrics.pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-gray-700 text-base mb-1 mt-3">
                    <span className="font-bold text-green-600">
                      {metrics.totalSuccessfulOrders}
                    </span>{" "}
                    Successful
                  </p>
                  <p className="text-gray-700 text-base mb-1">
                    <span className="font-bold text-blue-600">
                      {metrics.totalPendingOrders}
                    </span>{" "}
                    Pending
                  </p>
                  <p className="text-gray-700 text-base">
                    <span className="font-bold text-red-600">
                      {metrics.totalFailedOrders}
                    </span>{" "}
                    Failed
                  </p>
                </div>

                {/* --- Card 2: Revenue & Profit (with 6 Months) --- */}
                <div className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    📈 Revenue & Profit
                  </h3>
                  {/* Today */}
                  <p className="text-gray-700 text-base mb-1">
                    <span className="font-bold text-green-600">
                      {formatCurrency(metrics.successfulSalesToday)}
                    </span>{" "}
                    (Rev)
                  </p>
                  <p className="text-gray-700 text-base mb-2 border-b pb-2">
                    <span className="font-bold text-green-700">
                      {formatCurrency(metrics.profitToday)}
                    </span>{" "}
                    (Profit) - <span className="text-sm italic">Today</span>
                  </p>
                  {/* Week */}
                  <p className="text-gray-700 text-base mb-1">
                    <span className="font-bold text-green-600">
                      {formatCurrency(metrics.successfulSalesWeek)}
                    </span>{" "}
                    (Rev)
                  </p>
                  <p className="text-gray-700 text-base mb-2 border-b pb-2">
                    <span className="font-bold text-green-700">
                      {formatCurrency(metrics.profitWeek)}
                    </span>{" "}
                    (Profit) - <span className="text-sm italic">This Week</span>
                  </p>
                  {/* Month */}
                  <p className="text-gray-700 text-base mb-1">
                    <span className="font-bold text-green-600">
                      {formatCurrency(metrics.successfulSalesMonth)}
                    </span>{" "}
                    (Rev)
                  </p>
                  <p className="text-gray-700 text-base mb-2 border-b pb-2">
                    <span className="font-bold text-green-700">
                      {formatCurrency(metrics.profitMonth)}
                    </span>{" "}
                    (Profit) -{" "}
                    <span className="text-sm italic">This Month</span>
                  </p>
                  {/* --- NEW: Last 6 Months --- */}
                  <p className="text-gray-700 text-base mb-1">
                    <span className="font-bold text-green-600">
                      {formatCurrency(metrics.successfulSalesLast6Months)}
                    </span>{" "}
                    (Rev)
                  </p>
                  <p className="text-gray-700 text-base mb-0">
                    <span className="font-bold text-green-700">
                      {formatCurrency(metrics.profitLast6Months)}
                    </span>{" "}
                    (Profit) -{" "}
                    <span className="text-sm italic">Last 6 Mo.</span>
                  </p>
                </div>

                {/* --- Card 3: Financial Overview --- */}
                <div className="bg-red-50 p-5 rounded-lg shadow-sm border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">
                    Financial Overview
                  </h3>
                  <p className="text-gray-700 text-base mb-2">
                    <span className="font-bold text-red-600">
                      {formatCurrency(metrics.lostValueFailedOrders)}
                    </span>
                    <br />
                    Lost from Failed Orders
                  </p>
                  <p className="text-gray-700 text-base">
                    <span className="font-bold text-orange-600">
                      {formatCurrency(metrics.pendingValueWeek)}
                    </span>
                    <br />
                    Pending Value (This Week)
                  </p>
                </div>

                {/* --- Card 4: UPDATED Key Metrics (Annual) --- */}
                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                    Key Metrics (Last 12 Mo.)
                  </h3>
                  <p className="text-gray-700 text-base mb-3">
                    <span className="font-bold text-indigo-600 text-2xl">
                      {formatCurrency(metrics.averageOrderValueLast12Months)}
                    </span>
                    <br />
                    Avg. Order Value
                  </p>
                  <p className="text-gray-700 text-base mb-3">
                    <span className="font-bold text-indigo-600 text-2xl">
                      {formatCurrency(metrics.successfulSalesLast12Months)}
                    </span>
                    <br />
                    Total Revenue
                  </p>
                  <p className="text-gray-700 text-base mb-3">
                    <span className="font-bold text-indigo-600 text-2xl">
                      {formatCurrency(metrics.profitLast12Months)}
                    </span>
                    <br />
                    Total Profit
                  </p>
                  <p className="text-gray-700 text-base">
                    <span className="font-bold text-indigo-600 text-2xl">
                      {metrics.totalCustomers}
                    </span>
                    <br />
                    Total Unique Customers (All-Time)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center">
                📈 Sales Analytics (Last 7 Days)
              </h2>
              <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={metrics.salesChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₦${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" />
                    <Bar dataKey="profit" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center">
            🚀 Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item) =>
              //if item is falsy or empty, skip rendering
              !item ? null : (
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
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
