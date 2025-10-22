import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useContext } from "react";
import { storeContext } from "../context/storeContext";
import { Link } from "react-router-dom";

function Login() {
  const { isLoading, setIsLoading, setIsAuth, isAuth, API_URL, isAdmin, setIsAdmin, setIsManager, isManager } =
    useContext(storeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const toggle = () => setShowPassword(!showPassword);

  function onChangeEmail(e) {
    setEmail(e.target.value);
  }
  function onChangePassword(e) {
    setPassword(e.target.value);
  }

  //if auth is true, navigate to orders
  useEffect(() => {
    if (isAuth && isAdmin) {
      navigate("/admin/dashboard");
    } else if (isAuth) {
      navigate("/orders");
    }
  }, []);

  //logging user in
  async function loginHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    if (password.trim().length > 5) {
      const response = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      // console.log(data);
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        const token = data.access_token;
        let decodedPayload;
        const [, payload] = token.split(".");
        decodedPayload = JSON.parse(atob(payload));
        setIsAuth(true);
        if (decodedPayload.isAdmin === true) {
          setIsAdmin(true);
          navigate("/admin/dashboard");
        } else if (decodedPayload.isManager === true) {
          setIsManager(true);
          navigate("/manager/dashboard");
        } else{
          setIsAdmin(false);
          setIsManager(false);
          navigate("/orders");
        }
      } else {
        toast.error(data);
        setEmail("");
        setPassword("");
      }
      setIsLoading(false);
    } else {
      toast.error("Error.password must be at least 5 characters");
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-pink-600 sm:text-3xl">
            Sign In today
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
            Login to check the status of all your orders and also to check all
            you have bought with your hard earned money on our platform.
          </p>

          <form
            onSubmit={loginHandler}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium">
              Sign in to your account
            </p>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter email"
                  value={email}
                  onChange={onChangeEmail}
                  required
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter password"
                  value={password}
                  onChange={onChangePassword}
                  required
                />

                <span
                  className="absolute inset-y-0 end-0 grid place-content-center px-4"
                  onClick={toggle}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="block w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-gray-500">
              No account?
              <Link className="underline" to="/register">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
export default Login;
