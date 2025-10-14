"use client";
import { useEffect, useState } from "react";
import { User, Mail, Briefcase, Loader2, AlertTriangle, Copy } from "lucide-react";

export default function MePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="mt-4 text-gray-600 font-medium">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] p-4">
        <div className="max-w-md w-full p-6 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-red-800 mb-1">Access Denied</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center pt-24 pb-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="bg-indigo-600 p-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          <div className="p-3 bg-white/20 rounded-full">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Editable Info */}
        <div className="p-8 space-y-6">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-black"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500 uppercase">Full Name</p>
                <p className="text-xl font-semibold text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase">Email Address</p>
                <p className="text-xl font-semibold text-gray-900">{user.email}</p>
              </div>
            </>
          )}

          {/* Role Display */}
          <div>
            <p className="text-sm text-gray-500 uppercase">Account Role</p>
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-lg font-bold shadow-md 
              ${user.role === "tenant" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>

          {/* Landlord Code (if landlord) */}
          {user.role === "landlord" && user.landlordCode && !isEditing && (
            <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Landlord Code</p>
                <p className="text-lg font-semibold text-gray-900 font-mono">{user.landlordCode}</p>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-8 pt-0 flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
