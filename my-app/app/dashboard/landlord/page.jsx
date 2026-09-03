"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Wrench,
  CheckCircle2,
  Clock,
  Loader2,
  ListOrdered,
  Building2,
  Search,
  Tag,
  Eye,
  ImageIcon,
  Video,
  Paperclip,
} from "lucide-react";

export default function LandlordDashboard() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchComplaints = useCallback(async (isSilent = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (!isSilent) setLoading(false);
      return;
    }

    if (!isSilent) setLoading(true);

    try {
      const res = await fetch("/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints(false);
    const interval = setInterval(() => fetchComplaints(true), 3000);

    const handleUpdate = () => fetchComplaints(true);
    window.addEventListener("notificationUpdate", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notificationUpdate", handleUpdate);
    };
  }, [fetchComplaints]);

  const changeStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token || statusUpdatingId) return;

    setStatusUpdatingId(id);

    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
        );
        window.dispatchEvent(new Event("notificationUpdate"));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Network error: Could not update complaint status.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "pending").length;
    const inProgress = complaints.filter((c) => c.status === "in-progress").length;
    const resolved = complaints.filter((c) => c.status === "resolved").length;
    return { total, pending, inProgress, resolved };
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesStatus = filterStatus === "all" || c.status === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.userId?.name?.toLowerCase().includes(q) ||
        c.userId?.email?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [complaints, filterStatus, searchQuery]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resolved</span>
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm">
            <Wrench className="w-3.5 h-3.5 text-indigo-600" />
            <span>In Progress</span>
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Landlord Control Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Maintenance Management
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1 font-medium">
              Track, prioritize, and update tenant repair complaints across your properties.
            </p>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-md shadow-slate-200/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Requests</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ListOrdered className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-md shadow-slate-200/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-md shadow-slate-200/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Wrench className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-md shadow-slate-200/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
            {[
              { id: "all", label: "All Issues" },
              { id: "pending", label: "Pending" },
              { id: "in-progress", label: "In Progress" },
              { id: "resolved", label: "Resolved" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === tab.id
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search complaints or tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>

        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
            <p className="text-slate-600 font-bold text-base">Loading complaint requests...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredComplaints.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
              <Wrench className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Complaints Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">
              {searchQuery || filterStatus !== "all"
                ? "Try clearing your filters or search terms to view all property issues."
                : "No maintenance requests have been filed by your tenants yet."}
            </p>
          </div>
        )}

        {/* Complaints List */}
        {!loading && filteredComplaints.length > 0 && (
          <div className="space-y-4">
            {filteredComplaints.map((c) => {
              const isUpdating = statusUpdatingId === c._id;
              const isResolved = c.status === "resolved";
              const tenantName = c.userId?.name || c.userId?.email || "Unknown Tenant";
              const tenantEmail = c.userId?.email || "";

              return (
                <div
                  key={c._id}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-indigo-200 transition-all duration-300 space-y-5"
                >
                  {/* Top Row: Title, Category, Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-bold text-slate-900">{c.title}</h2>
                        {c.category && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                            <Tag className="w-3 h-3" />
                            {c.category}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-2">
                        {c.description}
                      </p>
                      {c.mediaFiles?.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{c.mediaFiles.length} attachment{c.mediaFiles.length > 1 ? "s" : ""}</span>
                          {c.mediaFiles.filter(m => m.type === "image").length > 0 && (
                            <span className="flex items-center gap-0.5"><ImageIcon className="w-3 h-3" />{c.mediaFiles.filter(m => m.type === "image").length}</span>
                          )}
                          {c.mediaFiles.filter(m => m.type === "video").length > 0 && (
                            <span className="flex items-center gap-0.5"><Video className="w-3 h-3" />{c.mediaFiles.filter(m => m.type === "video").length}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {getStatusBadge(c.status)}
                    </div>
                  </div>

                  {/* Bottom Footer Row: Tenant Details & Status Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    
                    {/* Tenant Info Badge */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {tenantName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{tenantName}</p>
                        {tenantEmail && tenantName !== tenantEmail && (
                          <p className="text-[11px] text-slate-500">{tenantEmail}</p>
                        )}
                      </div>
                    </div>

                    {/* Action Control Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      
                      {c.status !== "in-progress" && !isResolved && (
                        <button
                          onClick={() => changeStatus(c._id, "in-progress")}
                          disabled={isUpdating}
                          className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Start Work</span>
                            </>
                          )}
                        </button>
                      )}

                      {!isResolved && (
                        <button
                          onClick={() => changeStatus(c._id, "resolved")}
                          disabled={isUpdating}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Resolved</span>
                            </>
                          )}
                        </button>
                      )}

                      {isResolved && (
                        <span className="w-full sm:w-auto text-center px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                          ✓ Issue Completed
                        </span>
                      )}

                    </div>

                  </div>

                  {/* View Details link */}
                  <div className="border-t border-slate-100 pt-3 flex justify-end">
                    <button
                      onClick={() => router.push(`/complaints/${c._id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition cursor-pointer shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Full Details
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}