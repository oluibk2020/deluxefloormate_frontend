import { useContext, useState, useCallback , useEffect} from "react";
import { storeContext } from "../context/storeContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCog } from "react-icons/fa"; // This icon is not used in the original component, but kept if you plan to use it.

function ManageRoles() {
  const [email, setEmail] = useState("");
  const [managerRoleStatus, setManagerRoleStatus] = useState(false);

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
      const response = await fetch(`${API_URL}/user/role/manager`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          managerRoleStatus: Boolean(managerRoleStatus),
        }),
      });

       const data = await response.json();
       if (!response.ok) {
         const error = data.message;

         if (typeof error === "string") {
           toast.error(error);
           setIsLoading(false);
           return;
         }

         error.forEach((error) => {
           toast.error(error);
         });
         setIsLoading(false);
         return;
       }

      toast.success("User status updated successfully");
      navigate("/admin/dashboard");
      clearForm();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("An error occurred while updating the user status.");
    } finally {
      setIsLoading(false);
    }
  }, [
    API_URL,
    email,
    managerRoleStatus,
    setIsLoading,
  ]);

  const clearForm = useCallback(() => {
    setEmail("");
    setManagerRoleStatus(false);
  }, []);

 



  return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-white rounded-lg shadow-xl border border-gray-200">
      <Link
        to="/admin/manage-orders"
        className="mb-8 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
      >
        🔙 Manage All Orders
      </Link>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitHandler();
        }}
      >
        {/* Details Section */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xl font-semibold mb-4 text-gray-800">
            <FaUserCog className="inline-block mr-2" /> Manage Users Role
          </p>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Registered User Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            {" "}
            <label
              htmlFor="featured"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Choose To Assign/Remove Manager Role
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="featured"
              name="featured" // Added name attribute
              value={managerRoleStatus} // Controlled component
              onChange={(e) => setManagerRoleStatus(e.target.value)} // Use the consolidated handler
              required
            >
              <option value="">Select to Manager</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`mt-8 w-full py-3 px-4 rounded-md text-white text-lg font-medium
                ${
                  isLoading
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                transition duration-150 ease-in-out`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
              Processing...
            </span>
          ) : (
            "Change User Role"
          )}
        </button>
      </form>
      {/* list of managed users */}
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xl font-semibold mb-4 text-gray-800">
          <FaUserCog className="inline-block mr-2" /> List of Managed Users
        </p>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Full Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Mobile
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.keys(managersList).length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No managed users available.
                      </p>
                    ) : (
                      managersList.map((manager, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {manager.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {manager.firstName + " " + manager.lastName}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {manager.mobile}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {manager.role ? "Manager" : "User"}
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
    </div>
  );
}
export default ManageRoles;
