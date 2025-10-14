"use client";

import { useRouter } from "next/navigation";

// Custom SVG Icons
const ComplaintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const TrackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CommunicationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" />
  </svg>
);

export default function Home() {
  const router = useRouter();

  // Handles all Get Started buttons
  const handleGetStarted = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/authPages/login");
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        router.push("/authPages/login");
        return;
      }

      const data = await res.json();
      const role = data.user.role;

      if (role === "tenant") router.push("/dashboard/tenant");
      else if (role === "landlord") router.push("/dashboard/landlord");
      else router.push("/authPages/login");
    } catch (err) {
      console.error(err);
      router.push("/authPages/login");
    }
  };

  return (
    <main className="bg-white text-gray-800">

      {/* Hero Section */}
      <section className="relative bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                Hassle-Free <span className="text-indigo-600">Rent Management</span> is Here
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                A modern platform for tenants to raise maintenance requests and for landlords to manage properties with complete transparency and efficiency.
              </p>
              <div className="mt-8 lg:flex justify-center lg:justify-start gap-4">
                <button
                  onClick={handleGetStarted}
                  className="inline-block bg-indigo-600 text-white font-semibold lg:mb-0 mb-2 px-7 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
                >
                  Get Started Free
                </button>
                <a
                  href="#features"
                  className="inline-block bg-white text-slate-700 font-semibold px-8 py-3 rounded-lg border border-slate-200 hover:bg-slate-100 transition-transform transform hover:scale-105"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://www.obrienrealestate.com.au/wp-content/uploads/2021/09/property-maintenance-checklist.png"
                alt="Property Management Dashboard"
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Choose Our Platform?</h2>
            <p className="mt-4 text-lg text-slate-600">Everything you need to streamline property maintenance and communication.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto">
                <ComplaintIcon />
              </div>
              <h3 className="font-semibold text-xl text-slate-800 mt-6">Easy Complaint Submission</h3>
              <p className="mt-2 text-slate-600">Tenants can quickly submit detailed maintenance complaints with images and descriptions in just a few clicks.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto">
                <TrackIcon />
              </div>
              <h3 className="font-semibold text-xl text-slate-800 mt-6">Real-Time Status Tracking</h3>
              <p className="mt-2 text-slate-600">Landlords and tenants can track the status of complaints from "Pending" to "Resolved" with full visibility.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto">
                <CommunicationIcon />
              </div>
              <h3 className="font-semibold text-xl text-slate-800 mt-6">Seamless Communication</h3>
              <p className="mt-2 text-slate-600">Built-in chat allows for direct and clear communication between landlords and tenants regarding specific issues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center py-20 lg:py-24 px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Ready to Modernize Your Renting Experience?</h2>
          <p className="mt-4 text-lg text-indigo-100">Sign up today and discover a smarter way to manage property maintenance.</p>
          <div className="mt-8">
            <button
              onClick={handleGetStarted}
              className="inline-block bg-white text-indigo-600 font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
