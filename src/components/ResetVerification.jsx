import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useContext, useState, useEffect } from "react";
import { storeContext } from "../context/storeContext";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetVerification() {
  const { isLoading, setIsLoading, userEmail, API_URL } =
    useContext(storeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    otp: "",
  });

  const { email, password, password_confirmation, otp } = formData;

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  //logging user in
  async function resetPassword() {
    try {
      setIsLoading(true);
      if (otp < 100000 || otp > 999999) {
        toast.error("Your OTP needs to be 6 digits");
        return;
      }

      if (password.length < 8) {
        toast.error("Your Password needs to at least 8 characters");
        return;
      }

      if (password !== password_confirmation) {
        toast.error("Passwords do not match");
        return;
      }

      if (email.trim().length !== "") {
        const response = await fetch(`${API_URL}/token/reset-password`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            newPassword: password,
            token: Number(otp),
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

        toast.success("password reset successfully");
        navigate("/login");

        setFormData({
          otp: "",
          password: "",
          password_confirmation: "",
        });
      } else {
        toast.error("No email available");
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Network error: try again");
    }
  }

  function resetHandler(e) {
    e.preventDefault();
    resetPassword();
    setIsLoading(false);
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-primary sm:text-3xl">
            Reset your password Here Finally.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
            Be ready with your token from your email to reset your password.
          </p>

          <form
            onSubmit={resetHandler}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium">
              Let's help you gain access into your account
            </p>

            <div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium "
                >
                  {" "}
                  New Password{" "}
                </label>

                <input
                  type="password"
                  id="Password"
                  value={password}
                  onChange={onChange}
                  required
                  name="password"
                  className="mt-1 w-full rounded-md border-gray-600 bg-white text-sm text-gray-700 shadow-sm p-3"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="PasswordConfirmation"
                  className="block text-sm font-medium "
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
                  className="mt-1 w-full rounded-md border-gray-600 bg-white text-sm text-gray-700 shadow-sm p-3"
                />
              </div>

              {password_confirmation.trim().length >= 8 ? (
                <div className="col-span-6 mt-3">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-bold text-white"
                  >
                    {" "}
                    Your Reset Token from your email{" "}
                  </label>

                  <input
                    type="number"
                    id="otp"
                    value={otp}
                    required
                    onChange={onChange}
                    name="otp"
                    maxLength="5"
                    className="mt-1 w-full rounded-md border-gray-600 bg-white text-sm text-gray-700 shadow-sm p-3"
                  />
                </div>
              ) : null}
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
export default ResetVerification;
