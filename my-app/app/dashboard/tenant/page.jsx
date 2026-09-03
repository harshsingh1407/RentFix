"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  X,
  Loader2,
  Send,
  FileText,
  CheckCircle2,
  Wrench,
  Clock,
  Tag,
  Users,
  Search,
  ImageIcon,
  Video,
  Paperclip,
  Eye,
  Trash2,
} from "lucide-react";

export default function TenantDashboard() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Media upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");

  const categoriesList = ["Plumbing", "Electrical", "HVAC / AC", "Appliance Repair", "Carpentry", "General"];

  const ALLOWED_TYPES = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "video/mp4", "video/webm", "video/quicktime",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ _id: payload.id, email: payload.email });
    } catch (err) {
      console.error("Invalid token", err);
      setUser(null);
    }
  }, []);

  const fetchComplaints = useCallback(async (isSilent = false) => {
    const token = localStorage.getItem("token");
    if (!token) return setComplaints([]);
    if (!isSilent) setIsFetching(true);

    try {
      const res = await fetch("/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
      if (!isSilent) setComplaints([]);
    } finally {
      if (!isSilent) setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchComplaints(false);
      const interval = setInterval(() => fetchComplaints(true), 3000);

      const handleUpdate = () => fetchComplaints(true);
      window.addEventListener("notificationUpdate", handleUpdate);

      return () => {
        clearInterval(interval);
        window.removeEventListener("notificationUpdate", handleUpdate);
      };
    }
  }, [user, fetchComplaints]);

  // --- File selection & preview ---
  const handleFileSelect = (e) => {
    setUploadError("");
    const newFiles = Array.from(e.target.files || []);

    const invalid = newFiles.find((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalid) {
      setUploadError(`"${invalid.name}" is not a supported file type.`);
      return;
    }

    const total = selectedFiles.length + newFiles.length;
    if (total > 5) {
      setUploadError("You can attach a maximum of 5 files per complaint.");
      return;
    }

    const oversize = newFiles.find((f) => f.size > 4 * 1024 * 1024);
    if (oversize) {
      setUploadError(`"${oversize.name}" exceeds the 4 MB limit.`);
      return;
    }

    const withPreviews = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      name: file.name,
    }));

    setSelectedFiles((prev) => [...prev, ...withPreviews]);
    e.target.value = "";
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // --- Form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert("Please fill out the Title and Description.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit a complaint.");
      return;
    }

    setLoading(true);
    setUploadError("");

    try {
      // Send everything as multipart/form-data in ONE request
      // Files are sent as raw binary — server converts to base64 and stores in MongoDB
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category || "general");
      selectedFiles.forEach(({ file }) => formData.append("files", file));

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        // Do NOT set Content-Type manually — browser sets multipart boundary automatically
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setComplaints([data.complaint, ...complaints]);
        setForm({ title: "", description: "", category: "" });
        setSelectedFiles([]);
        setShowForm(false);
        window.dispatchEvent(new Event("notificationUpdate"));
      } else {
        setUploadError(data.error || "Failed to create complaint");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error submitting complaint");
    }
  };


  const stats = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  }), [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesStatus = filterStatus === "all" || c.status === filterStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [complaints, filterStatus, searchQuery]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm">
            <Wrench className="w-3.5 h-3.5 text-indigo-600" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Tenant Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Tenant Dashboard</h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1 font-medium">
              Submit maintenance requests and track resolution updates in real-time.
            </p>
          </div>

          <button
            onClick={() => { setShowForm(!showForm); setForm({ title: "", description: "", category: "" }); setSelectedFiles([]); setUploadError(""); }}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg cursor-pointer ${
              showForm
                ? "bg-slate-800 hover:bg-slate-900 text-white shadow-slate-900/20"
                : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-600/30 transform hover:-translate-y-0.5"
            }`}
          >
            {showForm ? <><X className="w-4 h-4" /><span>Close Form</span></> : <><PlusCircle className="w-4 h-4" /><span>New Complaint</span></>}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "Total Filed", value: stats.total, color: "indigo", Icon: FileText },
            { label: "Pending", value: stats.pending, color: "amber", Icon: Clock },
            { label: "In Progress", value: stats.inProgress, color: "indigo", Icon: Wrench },
            { label: "Resolved", value: stats.resolved, color: "emerald", Icon: CheckCircle2 },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-md shadow-slate-200/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className={`text-2xl sm:text-3xl font-black mt-1 text-${color}-600`}>{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-${color}-50 border border-${color}-100 flex items-center justify-center text-${color}-600`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Complaint Form Panel */}
        {showForm && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-indigo-200 shadow-xl shadow-indigo-100/70 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Submit New Maintenance Complaint</h2>
                  <p className="text-xs text-slate-500 font-medium">Provide clear details to help your landlord address the issue quickly.</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Complaint Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Kitchen Sink Water Leak or Air Conditioner Not Cooling"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Description *</label>
                <textarea
                  placeholder="Describe what's broken, when it started, and any specific access instructions..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all resize-none"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Plumbing, Electrical, Common Area"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Suggestions:</span>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        form.category === cat
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── Media Upload Section ─── */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Attach Photos / Videos
                  <span className="ml-2 text-[11px] font-medium text-slate-400 normal-case">Up to 5 files · 4 MB each · JPG, PNG, GIF, WebP, MP4, WebM, MOV</span>
                </label>

                {/* Drop Zone */}
                <label
                  htmlFor="media-upload"
                  className="flex flex-col items-center justify-center gap-2 w-full py-6 px-4 border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40 rounded-2xl transition cursor-pointer text-center"
                >
                  <Paperclip className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">Click to select files</span>
                  <span className="text-[11px] text-slate-400">or drag & drop here</span>
                  <input
                    id="media-upload"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={selectedFiles.length >= 5}
                  />
                </label>

                {/* Error */}
                {uploadError && (
                  <p className="mt-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
                    {uploadError}
                  </p>
                )}

                {/* Preview grid */}
                {selectedFiles.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {selectedFiles.map((sf, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square">
                        {sf.type === "image" ? (
                          <img src={sf.preview} alt={sf.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-slate-900 text-slate-300">
                            <Video className="w-6 h-6" />
                            <span className="text-[10px] px-1 text-center truncate max-w-full">{sf.name}</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Complaint</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
            {[{ id: "all", label: "My Complaints" }, { id: "pending", label: "Pending" }, { id: "in-progress", label: "In Progress" }, { id: "resolved", label: "Resolved" }].map((tab) => (
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
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search my issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
          </div>
        </div>

        {/* Loading */}
        {isFetching && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
            <p className="text-slate-600 font-bold text-base">Loading your complaint history...</p>
          </div>
        )}

        {/* Empty state */}
        {!isFetching && filteredComplaints.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Complaints Submitted</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">
              {searchQuery || filterStatus !== "all"
                ? "No complaints match your current filter settings."
                : "You haven't submitted any complaints yet. Click 'New Complaint' above to file a request."}
            </p>
          </div>
        )}

        {/* Complaints list */}
        {!isFetching && filteredComplaints.length > 0 && (
          <div className="space-y-4">
            {filteredComplaints.map((c) => (
              <div
                key={c._id}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-slate-900">{c.title}</h2>
                      {c.category && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                          <Tag className="w-3 h-3" />
                          {c.category}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-2">{c.description}</p>
                    {c.mediaFiles?.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{c.mediaFiles.length} attachment{c.mediaFiles.length > 1 ? "s" : ""}</span>
                        {c.mediaFiles.filter(m => m.type === "image").length > 0 && (
                          <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" />{c.mediaFiles.filter(m => m.type === "image").length}</span>
                        )}
                        {c.mediaFiles.filter(m => m.type === "video").length > 0 && (
                          <span className="flex items-center gap-1"><Video className="w-3 h-3" />{c.mediaFiles.filter(m => m.type === "video").length}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">{getStatusBadge(c.status)}</div>
                </div>

                {/* View Details Link */}
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
            ))}
          </div>
        )}

      </div>
    </div>
  );
}