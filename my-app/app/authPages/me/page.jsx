"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  Loader2,
  AlertTriangle,
  Copy,
  Check,
  Edit2,
  Trash2,
  Save,
  X,
  KeyRound,
  Building2,
  Users,
  Lock,
  ArrowLeft
} from "lucide-react";

export default function MePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState({ message: "", type: "" });

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in. Please sign in to view your profile.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          localStorage.removeItem("token");
          setError(data.error || "Authentication failed. Please log in again.");
          return;
        }

        setUser(data.user);
        setForm({
          name: data.user.name,
          email: data.user.email,
        });
      } catch (err) {
        setError("Failed to connect to the server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  const copyCode = () => {
    if (!user?.landlordCode) return;
    navigator.clipboard.writeText(user.landlordCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setUser(data.user);
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!deletePassword) {
      setDeleteFeedback({ message: "Please enter your password to confirm.", type: "error" });
      return;
    }

    setDeleting(true);
    setDeleteFeedback({ message: "", type: "" });
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/auth/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteFeedback({
          message: data.error || "Incorrect password. Please try again.",
          type: "error",
        });
        setDeletePassword("");
        return;
      }
      setDeleteFeedback({
        message: "Account successfully deleted. Redirecting...",
        type: "success",
      });

      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      setDeleteFeedback({
        message: "A network error occurred. Please try again.",
        type: "error",
      });
    } finally {
      if (deleteFeedback.type !== "success") {
        setDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-grid-pattern py-12 px-4">
        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-slate-700 font-bold text-sm">Loading your profile details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-grid-pattern py-12 px-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-rose-200 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
          <p className="text-slate-600 text-sm font-medium leading-relaxed">{error}</p>
          <div className="pt-2">
            <Link
              href="/authPages/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sign In to Continue</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-grid-pattern py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-cyan-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-300/60 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-8 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-black text-2xl shadow-inner">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">{user?.name}</h1>
                  <p className="text-xs text-indigo-100 font-medium">{user?.email}</p>
                </div>
              </div>

              <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Profile Card Body */}
          <div className="p-8 space-y-6">
            
            {isEditing ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</p>
                      <p className="text-base font-bold text-slate-900">{user?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</p>
                      <p className="text-base font-bold text-slate-900">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      {user?.role === "tenant" ? <Users className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Role</p>
                      <p className="text-base font-bold text-slate-900 capitalize">{user?.role}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    user?.role === "tenant"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : "bg-indigo-100 text-indigo-800 border-indigo-200"
                  }`}>
                    Active
                  </span>
                </div>

              </div>
            )}

            {/* Landlord Code Section */}
            {user?.role === "landlord" && user?.landlordCode && !isEditing && (
              <div className="bg-indigo-50/70 border border-indigo-200/90 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Landlord Property Code</span>
                  </div>

                  <button
                    onClick={copyCode}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xl font-mono font-black text-indigo-900 bg-white px-4 py-2.5 rounded-xl border border-indigo-200 text-center tracking-widest">
                  {user.landlordCode}
                </p>
                <p className="text-[11px] text-indigo-700 font-medium text-center">
                  Share this code with your tenants so they can register under your account.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md shadow-indigo-600/25 transition disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-3 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md shadow-indigo-600/20 transition cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setDeleteFeedback({ message: "", type: "" });
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 px-4 rounded-xl text-sm border border-rose-200 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form
            onSubmit={handleDelete}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-slate-200 space-y-5 animate-scaleUp"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Delete Account?</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                This action is <strong className="text-rose-600">permanent & irreversible</strong>. All your issues and data will be erased.
              </p>
            </div>

            {deleteFeedback.message && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                  deleteFeedback.type === "error"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {deleteFeedback.type === "error" ? (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <span>{deleteFeedback.message}</span>
              </div>
            )}

            <div>
              <label htmlFor="delete-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Enter Password to Confirm
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="delete-password"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeleteFeedback({ message: "", type: "" });
                  }}
                  placeholder="Your Account Password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                  disabled={deleting && deleteFeedback.type === "success"}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                disabled={deleting || !deletePassword || deleteFeedback.type === "success"}
                className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer transition flex items-center justify-center gap-2"
              >
                {deleting || deleteFeedback.type === "success" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{deleteFeedback.type === "success" ? "Redirecting..." : "Deleting..."}</span>
                  </>
                ) : (
                  <span>Permanently Delete Account</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword("");
                  setDeleteFeedback({ message: "", type: "" });
                }}
                disabled={deleting && deleteFeedback.type === "success"}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}