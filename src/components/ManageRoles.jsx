import { useContext, useState, useCallback, useEffect } from "react";
import { storeContext } from "../context/storeContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUserCog,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
  FaUserShield,
  FaIdBadge,
} from "react-icons/fa";

function ManageRoles() {
  const [email, setEmail] = useState("");
  // specific string state for select input control
  const [managerRoleStatus, setManagerRoleStatus] = useState("false");

  const {
    API_URL,
    token,
    isLoading,
    setIsLoading,
    managersList,
    fetchManagers,
  } = useContext(storeContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchManagers();
  }, []);

  const submitHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      // Convert string "true"/"false" to actual boolean for API
      const isManagerBool = managerRoleStatus === "true";

      const response = await fetch(`${API_URL}/user/role/manager`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          managerRoleStatus: isManagerBool,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const error = data.message;
        if (typeof error === "string") {
          toast.error(error);
        } else {
          error.forEach((err) => toast.error(err));
        }
        setIsLoading(false);
        return;
      }

      toast.success(
        `User role updated successfully to ${isManagerBool ? "Manager" : "User"}`,
      );
      // Refresh list immediately after update
      fetchManagers();
      clearForm();
      // Optional: Redirect or stay on page to see change
      // navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("An error occurred while updating the user status.");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, token, email, managerRoleStatus,  setIsLoading]); // Removed navigate to keep user on page to see result

  const clearForm = useCallback(() => {
    setEmail("");
    setManagerRoleStatus("false");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Navigation & Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          to="/admin/manage-orders"
          className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors duration-200 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Orders
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
            <FaUserCog size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Role Management
            </h1>
            <p className="text-gray-500 text-sm">
              Assign or revoke store manager privileges
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Action Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-8">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaUserShield /> Update User Role
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitHandler();
              }}
              className="p-6 space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="user@example.com"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="roleStatus"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Assign Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaIdBadge className="text-gray-400" />
                  </div>
                  <select
                    id="roleStatus"
                    value={managerRoleStatus}
                    onChange={(e) => setManagerRoleStatus(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="false">Regular User (Revoke Manager)</option>
                    <option value="true">Store Manager (Grant Access)</option>
                  </select>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {managerRoleStatus === "true"
                    ? "⚠ This user will have administrative access."
                    : "ℹ This user will have standard customer access."}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200
                  ${
                    isLoading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:transform active:scale-95"
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Data Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Current Managers
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {managersList?.length || 0} Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {!managersList || managersList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <FaUserCog className="text-4xl text-gray-300 mb-3" />
                          <p>No managers found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    managersList.map((manager, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                              {manager.firstName?.charAt(0) || "U"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {manager.firstName} {manager.lastName}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <FaEnvelope size={10} /> {manager.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center gap-2">
                            <FaPhone className="text-gray-400" size={12} />
                            {manager.mobile || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border 
                            ${
                              manager.isManager
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            {manager.isManager ? "Manager" : "User"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageRoles;
