"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Bell,
  CheckCheck,
  FilePlus,
  Wrench,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [fetchingNotifs, setFetchingNotifs] = useState(false);

  const notifRef = useRef(null);
  const router = useRouter();

  // Fetch logged in user
  const fetchUser = useCallback(() => {
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
    fetchUser();
  }, [fetchUser]);

  // Handle storage / custom auth events
  useEffect(() => {
    const handleAuthChange = () => {
      fetchUser();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [fetchUser]);

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setFetchingNotifs(true);
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setFetchingNotifs(false);
    }
  }, []);

  // Poll notifications every 3s if logged in + listen to instant notificationUpdate event
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 3000);

      const handleInstantUpdate = () => {
        fetchNotifications();
      };

      window.addEventListener("notificationUpdate", handleInstantUpdate);

      return () => {
        clearInterval(interval);
        window.removeEventListener("notificationUpdate", handleInstantUpdate);
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    setNotifOpen(false);
    const token = localStorage.getItem("token");

    if (!notif.read && token) {
      fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId: notif._id }),
      }).catch(console.error);

      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    if (notif.complaintId) {
      router.push(`/complaints/${notif.complaintId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
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

  const navItemClass = "text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3.5 py-2 rounded-xl hover:bg-indigo-50/60";
  const mobileLinkClass = "flex items-center gap-3 p-3 text-base text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all ease-in-out font-medium";
  const primaryButtonClass = "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:from-indigo-700 hover:to-violet-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2";
  const secondaryButtonClass = "text-indigo-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 transition duration-200 ease-in-out";

  const getNotifIcon = (type) => {
    switch (type) {
      case "new_complaint":
        return <FilePlus className="w-4 h-4 text-indigo-600" />;
      case "status_change":
        return <Wrench className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3.5">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-black text-lg">R</span>
          </div>
          <span className="text-slate-900 font-black">Rent</span>
          <span className="text-indigo-600 font-black">Fix</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3">
          {loading ? (
            <div className="h-9 w-40 bg-slate-100 rounded-xl animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-3">
              {dashboardText && (
                <Link href={dashboardLink} className={navItemClass}>{dashboardText}</Link>
              )}

              {/* ─── Notification Bell Dropdown ─── */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 border border-slate-200 bg-slate-50 rounded-full hover:bg-white hover:border-indigo-300 hover:shadow-md transition duration-150 relative group cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white shadow-md animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Panel */}
                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-scaleUp">
                    
                    {/* Panel Header */}
                    <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-indigo-600" />
                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700">
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center space-y-2">
                          <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="text-xs font-bold text-slate-500">No notifications yet</p>
                          <p className="text-[11px] text-slate-400">Updates on complaints will appear here.</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-4 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                              !n.read ? "bg-indigo-50/40" : ""
                            }`}
                          >
                            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 border border-indigo-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {getNotifIcon(n.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium ${!n.read ? "text-slate-900 font-bold" : "text-slate-700"}`}>
                                {n.message}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {new Date(n.createdAt).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  month: "short",
                                  day: "numeric"
                                })}
                              </p>
                            </div>

                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                )}
              </div>

              {/* Profile Link */}
              <button
                onClick={() => router.push("/authPages/me")}
                className="p-2 border border-slate-200 bg-slate-50 rounded-full hover:bg-white hover:border-indigo-300 hover:shadow-md transition duration-150 ease-in-out group cursor-pointer"
                title="Profile"
              >
                <User className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-rose-600 font-semibold text-sm px-3.5 py-2 rounded-xl hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 inline-block mr-1.5 align-sub" /> Logout
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

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center space-x-2">
          {user && (
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 border border-slate-200 bg-slate-50 rounded-full hover:bg-white relative"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          <button
            className="p-2 text-slate-700 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 py-4 shadow-2xl transition-all duration-300 ease-in-out">
          <div className="flex flex-col px-4 space-y-2.5">
            {loading ? (
              <div className="p-3 text-slate-400">Loading user data...</div>
            ) : user ? (
              <>
                {dashboardText && (
                  <Link href={dashboardLink} className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard className="w-5 h-5" />
                    {dashboardText}
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/authPages/me");
                  }}
                  className={mobileLinkClass}
                >
                  <User className="w-5 h-5" />
                  Profile Settings
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="mt-2 bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold text-base px-4 py-3 rounded-xl hover:from-rose-500 hover:to-red-500 transition shadow-lg shadow-rose-600/20"
                >
                  <LogOut className="w-5 h-5 inline-block mr-2 align-sub" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/authPages/login"
                  className={secondaryButtonClass.replace("px-5 py-2.5", "w-full text-center py-3")}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/authPages/register"
                  className={primaryButtonClass.replace("px-5 py-2.5", "w-full text-center py-3")}
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
