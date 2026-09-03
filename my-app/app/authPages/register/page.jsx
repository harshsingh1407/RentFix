"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, Building2, KeyRound, Loader2, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Users } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant",
    landlordCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          form.role === "tenant" ? form : { ...form, landlordCode: undefined }
        ),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      localStorage.setItem("token", data.user.token);
      window.dispatchEvent(new Event("authChange"));
      setSuccess("Registration successful! Redirecting...");

      setTimeout(() => {
        if (data.user.role === "tenant") router.push("/dashboard/tenant");
        else if (data.user.role === "landlord") router.push("/dashboard/landlord");
        else router.push("/");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-cyan-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xl shadow-slate-300/60 space-y-7">
          
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                R
              </div>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
              <p className="mt-1.5 text-sm text-slate-500 font-medium">Join RentFix to manage or log maintenance requests</p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 shadow-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="p-4 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 shadow-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "tenant" })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    form.role === "tenant"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Tenant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "landlord" })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    form.role === "landlord"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Landlord</span>
                </button>
              </div>
            </div>

            {/* Landlord/Property Code for Tenants */}
            {form.role === "tenant" && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Landlord / Property Code
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <KeyRound className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="landlordCode"
                    placeholder="Enter Property / Landlord Code"
                    value={form.landlordCode}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-sm font-medium text-slate-600 border-t border-slate-100">
            Already have an account?{" "}
            <Link
              href="/authPages/login"
              className="font-bold text-indigo-600 hover:text-indigo-700 transition duration-150"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
