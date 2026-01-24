import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { storeContext } from "../context/storeContext";

export default function Setting() {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const [qrCode, setQrCode] = useState(null);
  const [manualKey, setManualKey] = useState(null);
  const [otp, setOtp] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [codesDownloaded, setCodesDownloaded] = useState(false);

  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disableToken, setDisableToken] = useState("");

  const { API_URL, token } = useContext(storeContext);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 🔐 Check 2FA status on page load
  useEffect(() => {
    const check2FAStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/2fa/status`, {
          headers: authHeaders,
        });

        if (!res.ok) throw new Error("Failed to fetch 2FA status");

        const data = await res.json();
        setIs2FAEnabled(data.is2faEnabled);
      } catch (err) {
        toast.error("Unable to verify 2FA status");
      } finally {
        setCheckingStatus(false);
      }
    };

    check2FAStatus();
  }, []);

  // Step 1: Initiate 2FA
  const enable2FA = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/2fa/setup`, {
        method: "POST",
        headers: authHeaders,
      });

      if (!res.ok) throw new Error("Failed to initiate 2FA");

      const data = await res.json();
      setQrCode(data.qrCode);
      setManualKey(data.manualKey);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verify2FA = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/2fa/verify`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ token: otp }),
      });

      if (!res.ok) throw new Error("Invalid verification code");

      const data = await res.json();
      setBackupCodes(data.backupCodes);
      setIs2FAEnabled(true);

      toast.success("Two-factor authentication enabled");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Disable 2FA
  const disable2FA = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/2fa/disable`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ token: disableToken }),
      });

      if (!res.ok) throw new Error("Failed to disable 2FA");

      toast.success("Two-factor authentication disabled");

      // Reset everything
      setIs2FAEnabled(false);
      setQrCode(null);
      setManualKey(null);
      setOtp("");
      setBackupCodes([]);
      setDisableToken("");
      setCodesDownloaded(false);
      setShowDisableModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // One-time download backup codes
  const downloadBackupCodes = () => {
    const content = backupCodes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-codes.txt";
    a.click();

    URL.revokeObjectURL(url);

    setCodesDownloaded(true);
    setBackupCodes([]);
    toast.info("Backup codes downloaded. Save them securely.");
  };

  // ⏳ Prevent flicker before status is known
  if (checkingStatus) {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center text-gray-500">
        Checking security settings...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-12 bg-white border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Security Settings</h2>

      {/* Enable 2FA (only if disabled) */}
      {!is2FAEnabled && !qrCode && (
        <div className="flex items-center justify-between">
          <span className="font-medium">
            Enable Two-Factor Authentication (2FA)
          </span>
          <button
            onClick={enable2FA}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            Enable
          </button>
        </div>
      )}

      {/* QR Setup */}
      {qrCode && !is2FAEnabled && (
        <div className="mt-6 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Download Google Authenticator from App Store and Scan The QR Code</h3>

          <img
            src={qrCode}
            alt="2FA QR Code"
            className="w-48 h-48 mx-auto my-4"
          />

          <p className="text-sm text-gray-600 mb-2">
            Or enter this key manually:
          </p>
          <p className="font-mono text-center text-lg mb-4 break-words">{manualKey}</p>

          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3 text-center tracking-widest"
          />

          <button
            onClick={verify2FA}
            disabled={loading || otp.length < 6}
            className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            Verify & Enable
          </button>
        </div>
      )}

      {/* Backup Codes */}
      {backupCodes.length > 0 && !codesDownloaded && (
        <div className="mt-6 border rounded-lg p-4 bg-green-50">
          <h3 className="font-semibold mb-2">Backup Codes</h3>
          <p className="text-sm text-gray-600 mb-3">
            Download these now. You won’t be able to see them again.
          </p>

          <button
            onClick={downloadBackupCodes}
            className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Download Backup Codes
          </button>
        </div>
      )}

      {/* Disable 2FA (only if enabled) */}
      {is2FAEnabled && (
        <div className="mt-6 border-t pt-6">
          <button
            onClick={() => setShowDisableModal(true)}
            className="w-full py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Disable 2FA
          </button>
        </div>
      )}

      {/* Disable Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Disable Two-Factor Authentication?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This will reduce your account security. Enter your authenticator
              code to continue.
            </p>

            <input
              type="text"
              placeholder="6-digit code"
              value={disableToken}
              onChange={(e) => setDisableToken(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4 text-center tracking-widest"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowDisableModal(false)}
                className="w-full py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={disable2FA}
                disabled={loading || disableToken.length < 6}
                className="w-full py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
              >
                Disable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
