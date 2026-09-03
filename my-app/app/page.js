"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Wrench,
  ShieldCheck,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Building2,
  Zap,
  ChevronRight,
  Star,
  ChevronDown,
  Layers,
  Lock,
  Smartphone,
  Check,
  Activity,
  FileText,
  Send,
  Sliders,
  BellRing
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [activeRoleTab, setActiveRoleTab] = useState("tenant");
  const [demoTicketStatus, setDemoTicketStatus] = useState("In Progress");
  const [activeFaq, setActiveFaq] = useState(null);

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

  const faqs = [
    {
      q: "Is RentFix completely free for tenants?",
      a: "Yes! Tenants can create an account, file maintenance complaints with media attachments, and communicate with their landlord 100% free of charge."
    },
    {
      q: "How do landlords receive complaints?",
      a: "As soon as a tenant files an issue, landlords receive real-time updates on their centralized issue dashboard with full details, photos, and urgency tags."
    },
    {
      q: "Can I communicate directly about specific maintenance issues?",
      a: "Absolutely. Every complaint thread includes a built-in direct messaging system so tenants and landlords can discuss work schedules, entry permissions, and status updates."
    },
    {
      q: "How does status tracking work?",
      a: "Issues move seamlessly through three transparent stages: Pending, In Progress, and Resolved. Both parties get clear visibility into the repair journey."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-grid-pattern">
        {/* Glowing Background Radial Effects for Light Mode */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/50 via-violet-200/30 to-cyan-200/30 blur-[130px] rounded-full pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-300/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
              {/* Floating Pill Tag */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 shadow-sm">
                <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-ping" />
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs sm:text-sm font-bold tracking-wide text-indigo-900">
                  Next-Gen Property Maintenance Platform
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Smart Maintenance. <br />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
                  Zero Hassle.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Empower tenants to raise issues instantly and provide landlords with a high-efficiency dashboard for real-time tracking, chat, and rapid resolution.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base px-7 py-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all duration-300 shadow-sm"
                >
                  <span>Explore Features</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Social Proof Checklist */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-600 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  <span>Instant Account Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  <span>No Setup Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  <span>Live Real-Time Status</span>
                </div>
              </div>

            </div>

            {/* Right Visual Card Hero Mockup */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              {/* Outer Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-300 to-violet-400 rounded-3xl blur-xl opacity-40 animate-pulse-glow" />

              {/* Card Container */}
              <div className="relative glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl shadow-slate-300/50 overflow-hidden">
                {/* Header Mockup */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono text-slate-500 font-medium ml-2">RentFix Live Dashboard</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                    Active System
                  </span>
                </div>

                {/* Hero Dashboard Preview Content */}
                <div className="space-y-4">
                  {/* Hero Image Showcase */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
                    <Image
                      src="/hero.webp"
                      alt="Property Management Dashboard"
                      width={800}
                      height={450}
                      className="w-full h-48 sm:h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 font-bold shadow-sm">
                        <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                        Plumbing Request #1042
                      </span>
                      <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-lg font-bold shadow-sm">
                        Resolved
                      </span>
                    </div>
                  </div>

                  {/* Simulated Activity Stream */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          PS
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Priya (Tenant)</p>
                          <p className="text-[11px] text-slate-500">Main Bathroom Leak</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">2 mins ago</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between shadow-sm">
                      <span className="flex items-center gap-2 font-medium text-indigo-900">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        "Plumber scheduled for 4 PM today."
                      </span>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>

                  {/* Floating Metric Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <p className="text-xs text-slate-500 font-medium">Response Speed</p>
                      <p className="text-lg font-black text-indigo-600">⚡ &lt; 24 Hrs</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <p className="text-xs text-slate-500 font-medium">Resolution Rate</p>
                      <p className="text-lg font-black text-emerald-600">99.4%</p>
                    </div>
                  </div>
                </div>

                {/* Subtitle Banner float */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-tl-xl shadow-md">
                  Transparent Workflow
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE ROLE SHOWCASE ================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
              Tailored Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
              Designed for Both Tenants & Landlords
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              Switch views below to see how RentFix simplifies maintenance management for both sides.
            </p>

            {/* Interactive Tab Switcher */}
            <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/70 shadow-inner">
              <button
                onClick={() => setActiveRoleTab("tenant")}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeRoleTab === "tenant"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>For Tenants</span>
              </button>

              <button
                onClick={() => setActiveRoleTab("landlord")}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeRoleTab === "landlord"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>For Landlords</span>
              </button>
            </div>
          </div>

          {/* Dynamic Tab Content Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/70">
            {activeRoleTab === "tenant" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Submit maintenance requests without phone tag or friction
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    No more unanswered phone calls or lost text messages. Submit complaints with detailed descriptions and images directly from your phone or computer.
                  </p>

                  <ul className="space-y-3 pt-2">
                    {[
                      "Fast 3-step complaint submission wizard",
                      "Attach photo proof & urgency indicators",
                      "Instant live tracking from pending to fixed",
                      "In-app chat thread linked directly to the issue"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <button
                      onClick={handleGetStarted}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/25"
                    >
                      <span>Submit Request Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-500 border-b border-slate-200 pb-3">
                    <span className="font-bold text-slate-800">Tenant View Demonstration</span>
                    <span className="text-xs text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full border border-indigo-200 font-bold">Tenant Portal</span>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">High Urgency</span>
                          <h4 className="text-base font-bold text-slate-900 mt-1.5">Kitchen Sink Pipe Leaking</h4>
                          <p className="text-xs text-slate-500 mt-1">Water is overflowing under the cabinet.</p>
                        </div>
                        <span className="text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200 font-bold">In Progress</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Standard</span>
                          <h4 className="text-base font-bold text-slate-900 mt-1.5">Bedroom Light Switch Replacement</h4>
                          <p className="text-xs text-slate-500 mt-1">Switch sparks slightly when toggled.</p>
                        </div>
                        <span className="text-xs text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">Resolved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Centralize all maintenance requests across your properties
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Say goodbye to scattered WhatsApp messages. Track all property issues, assign resolution statuses, and communicate transparently with your tenants.
                  </p>

                  <ul className="space-y-3 pt-2">
                    {[
                      "Unified landlord dashboard for all rental units",
                      "Instant complaint notification feed",
                      "Update status with one click (Pending → In Progress → Resolved)",
                      "Keep complete historical audit logs for your records"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                        <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <button
                      onClick={handleGetStarted}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition shadow-lg shadow-cyan-600/25"
                    >
                      <span>Manage Properties</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-500 border-b border-slate-200 pb-3">
                    <span className="font-bold text-slate-800">Landlord Control Board</span>
                    <span className="text-xs text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-full border border-cyan-200 font-bold">Landlord Portal</span>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Total Active Requests</p>
                        <p className="text-2xl font-black text-slate-900">4 Issues</p>
                      </div>
                      <div className="flex gap-2 text-xs font-bold">
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">2 Pending</span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">2 Fixed Today</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-800 font-bold">Unit 402 - Electrical Outage</span>
                        <span className="text-indigo-600 font-extrabold">Action Needed</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold">Mark In Progress</button>
                        <button className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold border border-slate-200">Open Chat</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ================= FEATURES GRID ================= */}
      <section id="features" className="py-20 lg:py-32 bg-white relative border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
              Powerful Core Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
              Everything You Need to Manage Rental Issues
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              Designed to eliminate delays, clear miscommunications, and establish complete transparency between tenant and landlord.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="glass-card glass-card-hover p-8 rounded-3xl border border-slate-200/90 relative group shadow-md hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100/70 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Complaint Submission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tenants can quickly submit detailed maintenance complaints with photos, category tags, and descriptions in just a few clicks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card glass-card-hover p-8 rounded-3xl border border-slate-200/90 relative group shadow-md hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-violet-100/70 border border-violet-200 flex items-center justify-center text-violet-600 mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-Time Status Tracking</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Landlords and tenants track status updates from "Pending" to "In Progress" to "Resolved" with complete visibility at every step.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card glass-card-hover p-8 rounded-3xl border border-slate-200/90 relative group shadow-md hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-cyan-100/70 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Seamless Built-In Chat</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Integrated messaging thread lets both sides discuss scheduling, repairs, and photo verification directly within the complaint context.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card glass-card-hover p-8 rounded-3xl border border-slate-200/90 relative group shadow-md hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Role-Based Access</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dedicated dashboards customized for Tenants and Landlords ensure data privacy, security, and authorized issue control.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card glass-card-hover p-8 rounded-3xl border border-slate-200/90 relative group shadow-md hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Urgency Prioritization</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Flag urgent repairs (water leaks, power failures) so landlords can address critical emergency requests first.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card glass-card-hover p-8 rounded-3xl border border-slate-200/90 relative group shadow-md hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-100/70 border border-rose-200 flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Mobile Responsive</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Optimized layout for mobile phones, tablets, laptops, and desktop screens so you can manage rental issues anywhere.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE TICKET DEMO PLAYGROUND ================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-3xl p-8 sm:p-12 border border-indigo-200 relative overflow-hidden shadow-xl shadow-indigo-100/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Interactive Demo
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Try Updating Ticket Status Live
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  Experience how intuitive status progression works. Click any status pill on the right to see how ticket indicators change dynamically!
                </p>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {["Pending", "In Progress", "Resolved"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setDemoTicketStatus(status)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        demoTicketStatus === status
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      Set "{status}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Issue #T-8092</span>
                  </div>
                  
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full border transition-all duration-300 ${
                      demoTicketStatus === "Pending"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : demoTicketStatus === "In Progress"
                        ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                        : "bg-emerald-100 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    ● {demoTicketStatus}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-slate-900">AC Cooling Not Working in Living Room</h4>
                  <p className="text-xs text-slate-500 font-medium">Submitted by: Rahul M. (Flat 3B)</p>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-medium">
                    "The air conditioner is blowing warm air since yesterday afternoon. Needs technician check."
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500 font-semibold">
                  <span>Priority: <strong className="text-rose-600">High</strong></span>
                  <span>Updated: Just Now</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 lg:py-28 bg-white relative border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-200">
              Simple Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
              How RentFix Works in 4 Easy Steps
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              Streamlining property maintenance requests from start to completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up securely as a Tenant or Landlord with instant role-based access."
              },
              {
                step: "02",
                title: "Log Complaint",
                desc: "Tenants submit issue details, attach photos, and select urgency levels."
              },
              {
                step: "03",
                title: "Track & Communicate",
                desc: "Landlords review, update status in real-time, and discuss details via chat."
              },
              {
                step: "04",
                title: "Mark Resolved",
                desc: "Once fixed, the issue is closed and stored in a transparent digital record."
              }
            ].map((s, idx) => (
              <div key={idx} className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/90 relative hover:border-indigo-300 transition shadow-sm hover:shadow-md">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              User Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
              Trusted by Tenants and Landlords
            </h2>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              Hear from real users who simplified their renting experience with RentFix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 flex flex-col justify-between shadow-lg shadow-slate-200/50 hover:shadow-xl transition">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed font-medium">
                  "Repair requests used to take weeks of calling back and forth. Now, I file a complaint with a photo and the landlord starts work the next day. The tracking feature is amazing for peace of mind!"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Priya Sharma</h4>
                  <p className="text-xs text-indigo-600 font-bold">Tenant • Bangalore</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700">
                  PS
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 flex flex-col justify-between shadow-lg shadow-slate-200/50 hover:shadow-xl transition">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed font-medium">
                  "Managing multiple rental properties was a nightmare of emails and lost messages. RentFix centralizes everything into one single screen. My response time has drastically improved!"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Rajesh Kumar</h4>
                  <p className="text-xs text-cyan-600 font-bold">Landlord • Mumbai</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center font-bold text-xs text-cyan-700">
                  RK
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 flex flex-col justify-between shadow-lg shadow-slate-200/50 hover:shadow-xl transition">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed font-medium">
                  "The built-in chat is a game-changer. No more confusion over what needs to be fixed. It keeps a clean, professional record of all communication related to a specific issue."
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Aisha Singh</h4>
                  <p className="text-xs text-violet-600 font-bold">Tenant & Landlord User</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center font-bold text-xs text-violet-700">
                  AS
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-20 lg:py-28 bg-white relative border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 text-slate-900 font-bold text-base sm:text-lg hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-600 transition-transform duration-300 flex-shrink-0 ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-200/80 pt-4 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section className="py-20 lg:py-28 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-3xl p-10 sm:p-16 border border-indigo-500/30 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-center overflow-hidden shadow-2xl shadow-indigo-600/30">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Ready to Modernize Your Renting Experience?
              </h2>
              <p className="text-indigo-100 text-base sm:text-lg font-medium">
                Join thousands of tenants and landlords managing property maintenance with 100% transparency.
              </p>

              <div className="pt-4">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-3 bg-white hover:bg-slate-100 text-indigo-700 font-black text-base sm:text-lg px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5 text-indigo-700" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}