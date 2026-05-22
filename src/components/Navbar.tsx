import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-amber-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span>☕</span>
          <span>KopiEvent</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link to="/" className="hover:text-amber-300">
            Beranda
          </Link>
          <Link to="/biodata" className="hover:text-amber-300">
            Biodata
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/admin"
                className="bg-amber-700 hover:bg-amber-600 px-3 py-1.5 rounded-lg"
              >
                Admin Panel
              </Link>
              <span className="text-amber-300 text-xs hidden sm:block">
                {user?.nama}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-amber-600 hover:bg-amber-500 px-4 py-1.5 rounded-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;