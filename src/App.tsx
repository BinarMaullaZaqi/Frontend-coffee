import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/pages/public/HomePage";
import BiodataPage from "./pages/pages/public/BiodataPage";
import LoginPage from "./pages/pages/auth/LoginPage";
import DashboardPage from "./pages/pages/admin/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/biodata" element={<BiodataPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<DashboardPage />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center">
              <span className="text-5xl">☕</span>
              <h1 className="text-2xl font-bold text-gray-700">
                404 — Halaman tidak ditemukan
              </h1>
              <a href="/" className="text-amber-700 hover:underline text-sm">
                Kembali ke Beranda
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;