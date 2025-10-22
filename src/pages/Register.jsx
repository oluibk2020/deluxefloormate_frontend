import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useContext } from "react";
import {storeContext} from "../context/storeContext";

function Register() {
  const { isLoading, setIsLoading, APP_NAME } = useContext(storeContext);

   const navigate = useNavigate();

  //website url
  const API_URL = import.meta.env.VITE_BACKEND_URL;;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    mobile: "",
  });

  const {
    first_name,
    last_name,
    email,
    password,
    password_confirmation,
    mobile,
  } = formData;

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  //create Account
  async function createAccount(firstName, lastName, email, mobile, password) {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          mobile,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
          toast.success("Account created successfully");
           setFormData({
             first_name: "",
             last_name: "",
             email: "",
             password: "",
             password_confirmation: "",
             mobile: "",
           });
           navigate("/login")
        console.log("success", data);
      } else{
       toast.error (data[0].message);
      }

      setIsLoading(false);
      
      
    } catch (error) {
      console.log(error);
    }
  }

  function onSubmit(e) {
    e.preventDefault();

    if (password !== password_confirmation) {
      toast.error("Passwords do not match");
    } else {
      setIsLoading(true)
      createAccount(first_name, last_name, email, mobile, password)
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Night"
            src="https://images.pexels.com/photos/3801426/pexels-photo-3801426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <Link className="block text-white" to="/">
              <span className="sr-only">Home</span>
              <FaUserAlt className="text-5xl" />
            </Link>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to {APP_NAME}
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Sign up on our platform and get amazing benefits including
              discounts from our shop.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <Link
                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-pink-600 sm:h-20 sm:w-20"
                to="/"
              >
                <span className="sr-only">Home</span>
                <FaUserAlt className="text-3xl" />
              </Link>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to {APP_NAME}
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500">
                Sign up on our platform and get amazing benefits including
                discounts from our shop.
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>

                <input
                  type="text"
                  id="FirstName"
                  name="first_name"
                  value={first_name}
                  onChange={onChange}
                  required
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-3"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>

                <input
                  type="text"
                  id="LastName"
                  name="last_name"
                  value={last_name}
                  required
                  onChange={onChange}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-3"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {" "}
                  Email{" "}
                </label>

                <input
                  type="text"
                  id="Email"
                  value={email}
                  required
                  onChange={onChange}
                  name="email"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-3"
                />
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="Mobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  {" "}
                  Mobile{" "}
                </label>

                <input
                  type="number"
                  id="Mobile"
                  value={mobile}
                  required
                  onChange={onChange}
                  name="mobile"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-3"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {" "}
                  Password{" "}
                </label>

                <input
                  type="password"
                  id="Password"
                  value={password}
                  onChange={onChange}
                  required
                  name="password"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-3"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="PasswordConfirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password Confirmation
                </label>

                <input
                  type="password"
                  id="PasswordConfirmation"
                  value={password_confirmation}
                  onChange={onChange}
                  required
                  name="password_confirmation"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-3"
                />
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500">
                  By creating an account, you agree to our
                  <Link to="/" className="text-gray-700 underline">
                    {" "}
                    terms and conditions{" "}
                  </Link>
                  and
                  <Link to="/" className="text-gray-700 underline">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button className="inline-block shrink-0 rounded-md border border-pink-600 bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-pink-600 focus:outline-none focus:ring active:text-pink-500">
                  Create an account
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <Link to="/login" className="text-gray-700 underline">
                    Log in
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}
export default Register;
