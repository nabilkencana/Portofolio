import { useState, useEffect, useRef } from "react";
import { checkAdminPassword, loginAdmin } from "../lib/adminAuth";
import { ShieldCheck, Lock, Eye, EyeOff, X, AlertTriangle } from "lucide-react";

const AdminLoginModal = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const inputRef = useRef(null);

  // Auto-focus input
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Countdown timer saat locked
  useEffect(() => {
    if (!isLocked) return;
    if (lockTimer <= 0) {
      setIsLocked(false);
      setAttempts(0);
      return;
    }
    const t = setTimeout(() => setLockTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [isLocked, lockTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (checkAdminPassword(password)) {
      loginAdmin();
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword("");
      setError(
        newAttempts >= 3
          ? `Terlalu banyak percobaan. Coba lagi dalam ${30}s.`
          : `Password salah. (${newAttempts}/3)`
      );
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimer(30);
      }
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full max-w-sm mx-4 ${isShaking ? "animate-shake" : ""}`}
        style={{
          background: "linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(9,9,11,0.98) 100%)",
          border: "1px solid rgba(16,185,129,0.25)",
          borderRadius: "20px",
          boxShadow: "0 0 60px rgba(16,185,129,0.1), 0 25px 50px rgba(0,0,0,0.8)",
          padding: "2rem",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.05) 100%)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            {isLocked ? (
              <AlertTriangle size={28} style={{ color: "#f59e0b" }} />
            ) : (
              <ShieldCheck size={28} style={{ color: "#10b981" }} />
            )}
          </div>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif", letterSpacing: "-0.02em" }}
          >
            Admin Access
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            {isLocked
              ? `Dikunci selama ${lockTimer} detik`
              : "Masukkan password untuk melanjutkan"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              <Lock size={16} className="text-zinc-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Password admin..."
                disabled={isLocked}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "14px",
                  flex: 1,
                  fontFamily: "Inter, sans-serif",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "#ef4444" }}>
                <AlertTriangle size={12} />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || isLocked}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              cursor: !password || isLocked ? "not-allowed" : "pointer",
              background:
                !password || isLocked
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: !password || isLocked ? "#52525b" : "#fff",
              fontWeight: "600",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease",
              boxShadow: !password || isLocked ? "none" : "0 4px 20px rgba(16,185,129,0.3)",
            }}
          >
            {isLocked ? `Tunggu ${lockTimer}s...` : "Masuk ke Admin"}
          </button>
        </form>

        {/* Subtle hint */}
        <p className="text-center text-zinc-700 text-xs mt-6">
          Tekan Esc untuk tutup
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        .animate-shake {
          animation: shake 0.6s ease;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginModal;
