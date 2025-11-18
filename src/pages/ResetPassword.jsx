import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { storeContext } from "../context/storeContext";
import { Link } from "react-router-dom";

function ResetPassword() {
  const { isLoading, setIsLoading, setUserEmail, API_URL } =
    useContext(storeContext);
  
      const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
  const [email, setEmail] = useState("");
  const navigate = useNavigate();


  function onChangeEmail(e) {
    setEmail(e.target.value);
  }


  //logging user in
  async function resetHandler(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (email.trim().length !== "") {
        const response = await fetch(
          `${API_URL}/token/reset-password/generate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          }
        );

        setUserEmail(email); //set user email globally

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
        
          toast.success("Check your email for the token to reset your password");
          navigate("/resetpasswordverification");
        
        setIsLoading(false);
      } else {
        toast.error("Error resetting password, try again");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Network error: try again");
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>

      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-primary sm:text-3xl">
            Reset your password
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
            Did you forget your password? Let's help you login back to your
            account easily. We will send you a token to your email to reset your
            password
          </p>

          <form
            onSubmit={resetHandler}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium">
              Let's help you gain access into your account
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
                    className="h-4 w-4 text-gold-500"
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

            <button
              type="submit"
              className="block w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white"
            >
              Reset password
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
export default ResetPassword;
