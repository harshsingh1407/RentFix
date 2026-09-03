"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials. Please check your email and password.");
      localStorage.setItem("token", data.user.token);
      window.dispatchEvent(new Event("authChange"));
      setSuccess("Login successful! Redirecting...");
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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-cyan-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xl shadow-slate-300/60 space-y-8">
          
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                R
              </div>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
              <p className="mt-1.5 text-sm text-slate-500 font-medium">Log in to manage your rental complaints & issues</p>
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all duration-200"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all duration-200"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-sm font-medium text-slate-600 border-t border-slate-100">
            Don&apos;t have an account?{" "}
            <Link href="/authPages/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition duration-150">
              Create Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}