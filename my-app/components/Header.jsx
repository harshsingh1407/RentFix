"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => setUser(data.user))
          .catch(() => setUser(null));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    setUser(null);
    router.push("/");
  };

  const dashboardLink =
    user?.role === "tenant"
      ? "/dashboard/tenant"
      : user?.role === "landlord"
        ? "/dashboard/landlord"
        : "#";
  const dashboardText =
    user?.role === "tenant"
      ? "My Complaints"
      : user?.role === "landlord"
        ? "Manage Issues"
        : "";

  const navItemClass = "text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-md";
  const mobileLinkClass = "flex items-center gap-3 p-3 text-base text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-all ease-in-out";
  const primaryButtonClass = "bg-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2";
  const secondaryButtonClass = "text-indigo-600 font-medium text-sm px-4 py-2 rounded-lg hover:bg-indigo-50 transition duration-150 ease-in-out";

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-100 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
        <Link href="/" className="text-2xl font-extrabold text-indigo-700 tracking-tight">RentFix</Link>
        <nav className="hidden md:flex items-center space-x-2">
          {loading ? (
            <div className="h-9 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              {dashboardText && (
                <Link href={dashboardLink} className={navItemClass}>{dashboardText}</Link>
              )}

              <button onClick={() => router.push("/authPages/me")} className="p-2 border border-gray-200 bg-white rounded-full hover:shadow-md transition duration-150 ease-in-out group" title="Profile">
                <User className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
              </button>

              <button onClick={handleLogout} className="text-red-600 font-medium text-sm px-4 py-2 rounded-lg hover:bg-red-50 transition">
                <LogOut className="w-5 h-5 inline-block mr-1 align-sub" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/authPages/login" className={secondaryButtonClass}>
                Sign In
              </Link>
              <Link href="/authPages/register" className={primaryButtonClass}>
                Get Started
              </Link>
            </div>
          )}
        </nav>

        <button className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 shadow-2xl transition-all duration-300 ease-in-out">
          <div className="flex flex-col px-4 space-y-2">
            {loading ? (
              <div className="p-3 text-gray-400">Loading user data...</div>
            ) : user ? (
              <>
                {dashboardText && (
                  <Link href={dashboardLink} className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard className="w-5 h-5" />
                    {dashboardText}
                  </Link>
                )}

                <button onClick={() => {
                    setMenuOpen(false);
                    router.push("/authPages/me");
                  }}
                  className={mobileLinkClass}
                >
                  <User className="w-5 h-5" />
                  Profile Settings
                </button>

                <button onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="mt-2 bg-red-500 text-white font-semibold text-base px-4 py-3 rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut className="w-5 h-5 inline-block mr-2 align-sub" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/authPages/login" className={secondaryButtonClass.replace( "px-4 py-2", "w-full text-center py-3")}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/authPages/register"
                  className={primaryButtonClass.replace(
                    "px-4 py-2",
                    "w-full text-center py-3"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
