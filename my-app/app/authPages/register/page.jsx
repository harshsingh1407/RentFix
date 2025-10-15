"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

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
    <div className="pt-10 flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-lg space-y-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-md text-gray-500">Sign up to get started.</p>
        </div>

        {error && (
          <div className="p-3 text-sm font-medium text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm font-medium text-green-700 bg-green-100 border-l-4 border-green-500 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder:text-gray-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder:text-gray-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              required
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 3C5 3 1.73 7.11 1.07 9.65a1 1 0 000 .7C1.73 12.89 5 17 10 17s8.27-4.11 8.93-6.65a1 1 0 000-.7C18.27 7.11 15 3 10 3zM10 15c-3.07 0-5.64-2.5-6.91-5C4.36 7.5 6.93 5 10 5s5.64 2.5 6.91 5c-1.27 2.5-3.84 5-6.91 5z" />
                  <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 5.25A11.25 11.25 0 003.5 12c.983 2.17 2.396 3.992 4.197 5.25M13.5 18.75A11.25 11.25 0 0020.5 12c-.983-2.17-2.396-3.992-4.197-5.25"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21L3 3"
                  />
                </svg>
              )}
            </button>
          </div>

          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
          >
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
          </select>

          {form.role === "tenant" && (
            <input
              type="text"
              name="landlordCode"
              placeholder="Landlord/Property Code (Required for Tenant)"
              value={form.landlordCode}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder:text-gray-400"
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/authPages/login"
            className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-150"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
