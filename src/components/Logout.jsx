import { Link, useNavigate } from "react-router-dom";
import {storeContext} from "../context/storeContext";
import { toast } from "react-toastify";
import { useContext } from "react";

function Logout() {
  const { setIsAuth } = useContext(storeContext);

  const navigate = useNavigate();



  function logOut() {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/"); //go back to home on logout
    toast.success("You are logged out");
  }

  return (
    <div>
      <div className="rounded-lg bg-white p-8 shadow-2xl">
        <h2 className="text-lg font-bold">Are you sure you want to logout?</h2>

        <p className="mt-2 text-sm text-gray-500">
          Doing this means you have to login again to access your orders, are
          you 100% sure it's OK?
        </p>

        <div className="mt-4 flex gap-2">
          <Link
            onClick={logOut}
            to="/"
            className="rounded bg-green-50 px-4 py-2 text-sm font-medium text-green-600"
          >
           Yes, I'm sure
          </Link>

          <Link
            to= "/shop"
            className="rounded bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600"
          >Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Logout;
