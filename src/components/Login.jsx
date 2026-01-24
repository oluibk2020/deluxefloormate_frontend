import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { storeContext } from "../context/storeContext";
import { FaEyeSlash, FaEye } from "react-icons/fa";
function Login() {
  const {
    isLoading,
    setIsLoading,
    setIsAuth,
    isAuth,
    API_URL,
    isAdmin,
    setIsAdmin,
    setIsManager,
  } = useContext(storeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔐 2FA states
  const [requires2FA, setRequires2FA] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const toggle = () => setShowPassword(!showPassword);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuth && isAdmin) {
      navigate("/admin/dashboard");
    } else if (isAuth) {
      navigate("/orders");
    }
  }, []);

  function onChangeEmail(e) {
    setEmail(e.target.value);
  }

  function onChangePassword(e) {
    setPassword(e.target.value);
  }

  // 🟢 STEP 1: Email + Password Login
  async function loginHandler(e) {
    e.preventDefault();
    setIsLoading(true);

    if (password.trim().length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // 🔐 2FA required
      if (data.requires2fa) {
        setRequires2FA(true);
        setSessionId(data.sessionId);
        toast.info("Enter your 2FA verification code");
        setIsLoading(false);
        return;
      }

      // ✅ Normal login
      handleSuccessfulLogin(data.accessToken);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  // 🟢 STEP 2: Verify 2FA Token
  async function verify2faHandler(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/2fa/verify-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: otp,
          sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid verification code");
        setIsLoading(false);
        return;
      }

      handleSuccessfulLogin(data.accessToken);
    } catch (err) {
      toast.error("Verification failed");
    } finally {
      setIsLoading(false);
    }
  }

  // 🔑 Shared login success handler
  function handleSuccessfulLogin(token) {
    localStorage.setItem("token", token);

    const [, payload] = token.split(".");
    const decodedPayload = JSON.parse(atob(payload));

    setIsAuth(true);

    if (decodedPayload.isAdmin) {
      setIsAdmin(true);
      navigate("/admin/dashboard");
    } else if (decodedPayload.isManager) {
      setIsManager(true);
      navigate("/manager/dashboard");
    } else {
      setIsAdmin(false);
      setIsManager(false);
      navigate("/orders");
    }

    // Reset state
    setEmail("");
    setPassword("");
    setOtp("");
    setRequires2FA(false);
    setSessionId(null);
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-pink-600 sm:text-3xl">
          Sign In today
        </h1>

        <form
          onSubmit={requires2FA ? verify2faHandler : loginHandler}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">
            {requires2FA
              ? "Two-Factor Authentication"
              : "Sign in to your account"}
          </p>

          {!requires2FA && (
            <>
              <input
                type="email"
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                placeholder="Enter email"
                value={email}
                onChange={onChangeEmail}
                required
              />
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
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </div>
            </>
          )}

          {requires2FA && (
            <input
              type="text"
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm text-center tracking-widest"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            className="block w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white"
          >
            {requires2FA ? "Verify Code" : "Sign in"}
          </button>

          {!requires2FA && (
            <>
              <p className="text-center text-sm">
                <Link className="underline" to="/resetpassword">
                  Forgotten password?
                </Link>
              </p>
              <p className="text-center text-sm text-gray-500">
                No account?{" "}
                <Link className="underline" to="/register">
                  Sign up
                </Link>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
