import { useState } from "react";
import { GiShop } from "react-icons/gi";
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";

import { storeContext } from "../context/storeContext";
import { SlLogin, SlLogout } from "react-icons/sl";
import { FaUserAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { isAuth, APP_NAME, isAdmin, isManager } = useContext(storeContext);

  function checkNavbar() {
    if (!navbarOpen) {
      setNavbarOpen(true);
    } else {
      setNavbarOpen(false);
    }
  }

  return (
    <div className="no-print">
      <div>
        <section className="relative mx-auto">
          <nav className="flex justify-between bg-gray-900 text-white w-screen">
            <div className="px-5 xl:px-12 py-6 flex w-full items-center">
              <div className="flex-none px-2 mx-2">
                <GiShop className="text-3xl inline pr-2" />
                <Link to="/" className="text-lg font-bold">
                  {APP_NAME}
                </Link>
              </div>
              <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
                {isAdmin || isManager ? (
                  <li>
                    <NavLink
                      activeclassname="active"
                      className="hover:text-gray-200"
                      to={`/${isAdmin ? "admin" : "manager"}/dashboard`}
                    >
                      {isAdmin ? "Admin" : "Manager"} Dashboard
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      activeclassname="active"
                      className="hover:text-gray-200"
                      to="/"
                    >
                      Trending
                    </NavLink>
                  </li>
                )}
                {isAdmin ? (
                  <>
                    <li>
                      <NavLink
                        activeclassname="active"
                        className="hover:text-gray-200"
                        to="/admin/manage-products"
                      >
                        Manage Products
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        activeclassname="active"
                        className="hover:text-gray-200"
                        to="/shop"
                      >
                        Shop
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <li>
                    <NavLink
                      activeclassname="active"
                      className="hover:text-gray-200"
                      to="/shop"
                    >
                      Shop
                    </NavLink>
                  </li>
                )}
                {isAdmin || isManager ? (
                  <li>
                    <NavLink
                      activeclassname="active"
                      className="hover:text-gray-200"
                      to={`/${isAdmin ? "admin" : "manager"}/manage-orders`}
                    >
                      Manage Orders
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      activeclassname="active"
                      className="hover:text-gray-200"
                      to="/about"
                    >
                      About
                    </NavLink>
                  </li>
                )}
                {isAuth && !isAdmin && !isManager ? (
                  <li>
                    <NavLink
                      activeclassname="active"
                      className="hover:text-gray-200"
                      to="/orders"
                    >
                      My Orders
                    </NavLink>
                  </li>
                ) : null}
              </ul>
              <div className="hidden md:flex items-center space-x-5">
                <NavLink
                  activeclassname="active"
                  className="flex items-center hover:text-gray-200"
                  to="cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="flex absolute -mt-5 ml-4">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                </NavLink>

                {isAuth ? null : (
                  <Link
                    className="flex items-center hover:text-gray-200"
                    to="/register"
                  >
                    <FaUserAlt className="text-2xl" />

                    <span className="ml-2">Register</span>
                  </Link>
                )}
                {isAuth ? (
                  <Link
                    className="flex items-center hover:text-gray-200"
                    to="/logout"
                  >
                    <SlLogout className="text-2xl" />
                    <span className="ml-2">Logout</span>
                  </Link>
                ) : (
                  <Link
                    className="flex items-center hover:text-gray-200"
                    to="login"
                  >
                    <SlLogin className="text-2xl" />
                    <span className="ml-2">Login</span>
                  </Link>
                )}
              </div>
            </div>
            {isAdmin ? null : (
              <Link
                className="xl:hidden lg:hidden md:hidden flex mr-6 items-center"
                to="/cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 hover:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="flex absolute -mt-5 ml-4">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              </Link>
            )}
            <button
              className="navbar-burger self-center mr-12 xl:hidden lg:hidden md:hidden"
              onClick={checkNavbar}
            >
              {navbarOpen ? (
                <IoMdClose className="text-3xl" />
              ) : (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 hover:text-gray-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
              )}
            </button>
          </nav>
        </section>
        <div>
          {navbarOpen ? (
            <div
              className="lg:hidden md:hidden items-center justify-between w-full sm:flex sm:w-auto sm:order-1 "
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-4 md:p-0 mt-1 font-medium border border-gray-100 rounded-lg bg-gray-50 w-full text-2xl text-center">
                {isAdmin ? (
                  <li>
                    <NavLink
                      activeclassname="active"
                      to="/admin/dashboard"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                    >
                      Admin Dashboard
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      activeclassname="active"
                      to="/"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                    >
                      Trending
                    </NavLink>
                  </li>
                )}
                {isAdmin ? (
                  <li>
                    <NavLink
                      activeclassname="active"
                      to="/admin/manage-products"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                    >
                      Manage Products
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      activeclassname="active"
                      to="/about"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                    >
                      About
                    </NavLink>
                  </li>
                )}
                {isAdmin ? (
                  <li>
                    <NavLink
                      activeclassname="active"
                      to="/admin/manage-orders"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                    >
                      Manage Orders
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink
                      activeclassname="active"
                      to="/shop"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                    >
                      Shop
                    </NavLink>
                  </li>
                )}
                <li>
                  {isAuth ? null : (
                    <Link
                      to="/register"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                    >
                      Register
                    </Link>
                  )}
                </li>
                {isAuth && !isAdmin ? (
                  <li>
                    <NavLink
                      activeclassname="active"
                      to="/orders"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                    >
                      My Orders
                    </NavLink>
                  </li>
                ) : null}

                <li>
                  {isAuth ? (
                    <>
                      <Link
                        to="/logout"
                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                      >
                        Log out
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 "
                    >
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default Navbar;
