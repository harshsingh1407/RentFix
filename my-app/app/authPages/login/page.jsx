"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Icons for a better UI (using standard SVG paths, no external library needed)
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For loading state

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Simulate network request delay (remove this in production)
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }
      
      localStorage.setItem("token", data.user.token);
      window.dispatchEvent(new Event("authChange"));
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        if (data.user.role === "tenant") {
          router.push("/dashboard/tenant");
        } else if (data.user.role === "landlord") {
          router.push("/dashboard/landlord");
        } else {
          // fallback
          router.push("/");
        }
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-xl rounded-lg space-y-8 border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back!</h1>
          <p className="mt-2 text-md text-gray-500">Login to your account to continue.</p>
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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 sr-only">Email Address</label>
            <div className="mt-1 relative">
                {/* Icon position adjusted for P3 padding */}
               <span className="absolute inset-y-0 left-0 flex items-center pl-3"> 
                <MailIcon />
              </span>
              <input 
                id="email"
                type="email"
                placeholder="Email Address" 
                className="text-black block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })}
                required 
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700 sr-only">Password</label>
            <div className="mt-1 relative">
                {/* Icon position adjusted for P3 padding */}
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"> 
                    <LockIcon />
                </span>
                <input 
                    id="password"
                    type="password" 
                    placeholder="Password" 
                    className="text-black block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    value={form.password} 
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required 
                />
            </div>
          </div>
          
          {/* Submit Button with Loading State */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
          >
            {isLoading ? (
                <>
                {/* Custom Spinner SVG for consistent styling */}
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
                </>
            ) : (
              'Log In'
            )}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            href='/authPages/register' 
            className="font-medium text-indigo-600 hover:text-indigo-800 transition duration-150"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
