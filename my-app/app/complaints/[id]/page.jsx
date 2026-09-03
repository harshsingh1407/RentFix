"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Tag,
  User,
  Mail,
  Calendar,
  ImageIcon,
  Video,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  ZoomIn,
  Play,
  Film,
  Sparkles,
  Maximize2
} from "lucide-react";

const STATUS_BADGE = {
  resolved: (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
    </span>
  ),
  "in-progress": (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm">
      <Wrench className="w-3.5 h-3.5" /> In Progress
    </span>
  ),
  pending: (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-full bg-amber-100 text-amber-800 border border-amber-300 shadow-sm">
      <Clock className="w-3.5 h-3.5" /> Pending
    </span>
  ),
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [complaint, setComplaint] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [mediaTab, setMediaTab] = useState("all"); // "all", "images", "videos"

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const fetchComplaint = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load complaint.");
        return;
      }
      setComplaint(data.complaint);
      setRole(data.role);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  const changeStatus = async (newStatus) => {
    const token = localStorage.getItem("token");
    if (!token || statusUpdating) return;
    setStatusUpdating(true);
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
        setComplaint((prev) => ({ ...prev, status: newStatus }));
        window.dispatchEvent(new Event("notificationUpdate"));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevMedia = () =>
    setLightboxIndex((i) => (i - 1 + complaint.mediaFiles.length) % complaint.mediaFiles.length);
  const nextMedia = () =>
    setLightboxIndex((i) => (i + 1) % complaint.mediaFiles.length);

  // Close lightbox on Escape key & arrow keys
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && lightboxIndex !== null) prevMedia();
      if (e.key === "ArrowRight" && lightboxIndex !== null) nextMedia();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-slate-600 font-bold text-sm">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-3xl border border-rose-200 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Unable to Load Complaint</h2>
          <p className="text-slate-600 text-sm font-medium">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm cursor-pointer transition shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const media = complaint?.mediaFiles || [];
  const images = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");
  const isResolved = complaint?.status === "resolved";
  const tenantName = complaint?.userId?.name || complaint?.userId?.email || "Tenant";
  const tenantEmail = complaint?.userId?.email || "";

  const backHref = role === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back Link */}
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-700 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Main Complaint Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden">

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 sm:p-9 text-white">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-md shadow-sm">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Issue #</span>
                  </div>
                  {complaint?.category && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-md">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{complaint.category}</span>
                    </div>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
                  {complaint?.title}
                </h1>
                <p className="text-indigo-100 text-xs sm:text-sm font-medium">
                  Filed on {formatDate(complaint?.createdAt)}
                </p>
              </div>

              <div className="flex-shrink-0">
                {STATUS_BADGE[complaint?.status] || STATUS_BADGE.pending}
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-9 space-y-8">

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</h2>
              <div className="text-slate-800 text-base font-medium leading-relaxed bg-slate-50/80 border border-slate-200 rounded-2xl p-5 shadow-inner">
                {complaint?.description}
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-base flex-shrink-0 shadow-sm">
                  {tenantName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tenant Name</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{tenantName}</p>
                  {tenantEmail && tenantName !== tenantEmail && (
                    <p className="text-xs text-slate-500 truncate">{tenantEmail}</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 flex-shrink-0 shadow-sm">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{complaint?.category || "General"}</p>
                </div>
              </div>

              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 flex-shrink-0 shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date Filed</p>
                  <p className="text-sm font-bold text-slate-900">{formatDate(complaint?.createdAt)}</p>
                </div>
              </div>

              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 flex-shrink-0 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Status Update</p>
                  <p className="text-sm font-bold text-slate-900">{formatDate(complaint?.updatedAt)}</p>
                </div>
              </div>

            </div>

            {/* ─── ATTACHED MEDIA SHOWCASE ─── */}
            {media.length > 0 && (
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-5 sm:p-7 space-y-6">
                
                {/* Header & Filter Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight">Attached Evidence Media</h2>
                      <p className="text-xs text-slate-500 font-medium">Photos and videos submitted with this maintenance ticket.</p>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl border border-slate-300/60 self-start sm:self-auto">
                    {[
                      { id: "all", label: `All (${media.length})` },
                      { id: "images", label: `Photos (${images.length})` },
                      { id: "videos", label: `Videos (${videos.length})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setMediaTab(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          mediaTab === tab.id
                            ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* --- Photos Showcase --- */}
                {(mediaTab === "all" || mediaTab === "images") && images.length > 0 && (
                  <div className="space-y-3">
                    {mediaTab === "all" && (
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-indigo-600" />
                        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                          Photos ({images.length})
                        </h3>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((img, i) => {
                        const globalIndex = media.findIndex((m) => m === img);
                        return (
                          <div
                            key={i}
                            onClick={() => openLightbox(globalIndex)}
                            className="group relative rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all duration-300 cursor-pointer"
                          >
                            <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                              <img
                                src={img.url}
                                alt={img.filename || `Photo ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                                <span className="text-white text-xs font-bold flex items-center gap-1">
                                  <ZoomIn className="w-3.5 h-3.5" /> Click to enlarge
                                </span>
                                <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/30">
                                  Photo
                                </span>
                              </div>
                            </div>
                            <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                                {img.filename || `Evidence Photo ${i + 1}`}
                              </span>
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                                Full View
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* --- Videos Showcase --- */}
                {(mediaTab === "all" || mediaTab === "videos") && videos.length > 0 && (
                  <div className="space-y-3">
                    {mediaTab === "all" && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <Video className="w-4 h-4 text-indigo-600" />
                        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                          Videos ({videos.length})
                        </h3>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {videos.map((vid, i) => (
                        <div
                          key={i}
                          className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg flex flex-col justify-between"
                        >
                          {/* Video Top Title Bar */}
                          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center flex-shrink-0">
                                <Film className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold text-slate-200 truncate">
                                {vid.filename || `Evidence Video ${i + 1}`}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                              Video
                            </span>
                          </div>

                          {/* Player Container */}
                          <div className="relative w-full bg-black flex items-center justify-center p-2 min-h-[220px]">
                            <video
                              src={vid.url}
                              controls
                              playsInline
                              preload="metadata"
                              className="max-h-[320px] w-auto max-w-full rounded-xl object-contain"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {media.length === 0 && (
              <div className="text-center py-10 bg-slate-50/80 rounded-3xl border border-dashed border-slate-300 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">No Media Files Attached</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
                  The tenant did not include photo or video attachments with this ticket.
                </p>
              </div>
            )}

            {/* ─── Landlord Status Update Controls ─── */}
            {role === "landlord" && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div>
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Action Controls</h2>
                  <p className="text-xs text-slate-500 font-medium">Update ticket status to keep your tenant informed.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {complaint?.status !== "in-progress" && !isResolved && (
                    <button
                      onClick={() => changeStatus("in-progress")}
                      disabled={statusUpdating}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-sm transition disabled:opacity-50 cursor-pointer"
                    >
                      {statusUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wrench className="w-4 h-4" />
                      )}
                      <span>Set In Progress</span>
                    </button>
                  )}

                  {!isResolved && (
                    <button
                      onClick={() => changeStatus("resolved")}
                      disabled={statusUpdating}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition disabled:opacity-50 cursor-pointer"
                    >
                      {statusUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>Mark as Resolved</span>
                    </button>
                  )}

                  {isResolved && (
                    <span className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Issue Completed</span>
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ─── FULLSCREEN LIGHTBOX MODAL ─── */}
      {lightboxIndex !== null && media[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-50 cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-50 cursor-pointer border border-white/20 shadow-xl"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-50 cursor-pointer border border-white/20 shadow-xl"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Display Item */}
          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {media[lightboxIndex].type === "image" ? (
              <img
                src={media[lightboxIndex].url}
                alt={media[lightboxIndex].filename || "Attachment"}
                className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/10"
              />
            ) : (
              <video
                src={media[lightboxIndex].url}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl border border-white/10"
              />
            )}

            {/* Media Details Footer */}
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/20 flex items-center gap-3">
              <span>{media[lightboxIndex].filename || `File ${lightboxIndex + 1}`}</span>
              <span className="text-slate-400">•</span>
              <span>{lightboxIndex + 1} of {media.length}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
