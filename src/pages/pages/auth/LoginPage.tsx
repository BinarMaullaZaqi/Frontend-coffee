import { useState, FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    const berhasil = login(nim.trim(), password);

    if (berhasil) {
      navigate("/admin", { replace: true });
    } else {
      setError("NIM atau password salah. Silakan coba lagi.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="bg-amber-900 text-white rounded-t-2xl px-8 pt-8 pb-6 text-center">
          <div className="text-5xl mb-3">☕</div>
          <h1 className="text-2xl font-bold">Admin KopiEvent</h1>
          <p className="text-amber-200 text-sm mt-1">
            Masuk dengan NIM dan password kamu
          </p>
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg px-8 py-7">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                NIM
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: 2200123456"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-800 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>

          <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <p className="font-semibold mb-1">Akun demo:</p>
            <p>NIM: <span className="font-mono">2200123456</span> / Pass: <span className="font-mono">kopi123</span></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;