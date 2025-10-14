"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react"; // Assuming you have lucide-react installed for icons

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only send landlordCode if the role is tenant, otherwise, exclude it to keep the payload clean.
        body: JSON.stringify(
          form.role === "tenant" ? form : { ...form, landlordCode: undefined }
        ),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Save token and trigger auth change for navbar
      localStorage.setItem("token", data.user.token);
      window.dispatchEvent(new Event("authChange"));

      setSuccess("Registration successful! Redirecting...");

      setTimeout(() => {
        if (data.user.role === "tenant") router.push("/dashboard/tenant");
        else if (data.user.role === "landlord")
          router.push("/dashboard/landlord");
        else router.push("/");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Helper function for input change
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-lg space-y-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-md text-gray-500">Sign up to get started.</p>
        </div>

        {/* Message Boxes */}
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
          {/* Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-black placeholder:text-gray-400"
          />
          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-black placeholder:text-gray-400"
          />
          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-black placeholder:text-gray-400"
          />

          {/* Role Selector */}
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none text-black placeholder:text-gray-400"
          >
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
          </select>

          {/* Landlord Code input - show only for tenant */}
          {form.role === "tenant" && (
            <input
              type="text"
              name="landlordCode"
              placeholder="Landlord/Property Code (Required for Tenant)"
              value={form.landlordCode}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-black placeholder:text-gray-400"
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                Registering...
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