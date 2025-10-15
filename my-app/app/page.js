"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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
    <main className="bg-white text-gray-800 overflow-x-hidden">
      <section className="relative pt-16 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                Hassle-Free <span className="text-indigo-600">Rent Management</span> is Here
              </h1>
              <p className="mt-4 sm:mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                A modern platform for tenants to raise maintenance requests and for landlords to manage properties with complete transparency and efficiency.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-[1.02]"
                >
                  Get Started Free
                </button>
                <a
                  href="#features"
                  className="w-full sm:w-auto inline-block bg-white text-slate-700 font-semibold px-8 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition duration-300 ease-in-out transform hover:scale-[1.02]"
                >
                  Learn More
                </a>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 w-full max-w-screen-md mx-auto">
              <div className="rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
                <Image
                  src="/hero.webp"
                  alt="Property Management Dashboard"
                  width={1200}
                  height={600}
                  className="w-full h-auto object-cover"
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-full">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">Why Choose Our Platform?</h2>
            <p className="mt-4 text-lg text-slate-600">Everything you need to streamline property maintenance and communication.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300 hover:border-indigo-200">
              <div className="bg-indigo-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto shadow-md">
                <ComplaintIcon />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mt-6">Easy Complaint Submission</h3>
              <p className="mt-3 text-slate-600">Tenants can quickly submit detailed maintenance complaints with images and descriptions in just a few clicks.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300 hover:border-indigo-200">
              <div className="bg-indigo-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto shadow-md">
                <TrackIcon />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mt-6">Real-Time Status Tracking</h3>
              <p className="mt-3 text-slate-600">Landlords and tenants can track the status of complaints from "Pending" to "Resolved" with full visibility.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300 hover:border-indigo-200">
              <div className="bg-indigo-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto shadow-md">
                <CommunicationIcon />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mt-6">Seamless Communication</h3>
              <p className="mt-3 text-slate-600">Built-in chat allows for direct and clear communication between landlords and tenants regarding specific issues.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center py-20 lg:py-28 px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">Ready to Modernize Your Renting Experience?</h2>
          <p className="mt-4 text-lg text-indigo-100 opacity-90">Sign up today and discover a smarter, more efficient way to manage property maintenance.</p>
          <div className="mt-10">
            <button
              onClick={handleGetStarted}
              className="inline-block bg-white text-indigo-600 font-bold px-10 py-4 rounded-full shadow-2xl hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-[1.05] ring-4 ring-indigo-400/50"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-200/50 rounded-full">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">Trusted by Tenants and Landlords</h2>
            <p className="mt-4 text-lg text-slate-600">Hear from our users about how our platform has simplified their property management.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-xl border border-indigo-100/70 text-left">
              <p className="text-4xl text-indigo-500 font-serif mb-4">“</p>
              <p className="text-gray-700 italic">
                "Repair requests used to take weeks. Now, I file a complaint with a photo and the landlord starts work the next day. The tracking feature is amazing for peace of mind!"
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="font-semibold text-slate-800">Priya Sharma</p>
                <p className="text-sm text-indigo-600">Tenant, Bangalore</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-xl border border-indigo-100/70 text-left">
              <p className="text-4xl text-indigo-500 font-serif mb-4">“</p>
              <p className="text-gray-700 italic">
                "Managing multiple properties was a nightmare of emails and phone calls. This platform centralizes everything. My response time has drastically improved, making my tenants happier."
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="font-semibold text-slate-800">Rajesh Kumar</p>
                <p className="text-sm text-indigo-600">Landlord, Mumbai</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-xl border border-indigo-100/70 text-left">
              <p className="text-4xl text-indigo-500 font-serif mb-4">“</p>
              <p className="text-gray-700 italic">
                "The built-in chat is a game-changer. No more confusion over what needs to be fixed. It keeps a clean, professional record of all communication related to a specific issue."
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="font-semibold text-slate-800">Aisha Singh</p>
                <p className="text-sm text-indigo-600">Tenant & Landlord User</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}