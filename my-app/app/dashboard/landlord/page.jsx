"use client";
import { useEffect, useState, useCallback } from "react";
import { Wrench, CheckCircle, Clock, Loader2, ListOrdered } from "lucide-react";

export default function LandlordDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const getStatusClasses = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 ring-green-600/20";
      case "in-progress":
        return "bg-blue-100 text-blue-800 ring-blue-600/20";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800 ring-yellow-600/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case "in-progress":
        return <Wrench className="w-4 h-4 mr-1" />;
      case "pending":
      default:
        return <Clock className="w-4 h-4 mr-1" />;
    }
  };

  const fetchComplaints = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
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
        setComplaints(prev =>
          prev.map(c => (c._id === id ? { ...c, status: newStatus } : c))
        );
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


  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto py-6 sm:py-10">
        <div className="mb-6 sm:mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            <ListOrdered className="inline-block w-6 h-6 sm:w-8 sm:h-8 mr-2 text-indigo-600" />
            Complaint Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Review and manage all maintenance requests from your tenants.</p>
        </div>

        {loading && (
          <div className="flex flex-col sm:flex-row justify-center items-center p-8 sm:p-12 bg-white rounded-xl shadow-sm">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-indigo-500 mb-3 sm:mb-0 sm:mr-3" />
              <p className="text-lg sm:text-xl text-gray-600 font-medium text-center">Loading complaints list...</p>
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="text-center p-8 sm:p-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Wrench className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg sm:text-xl text-gray-600 font-medium">No complaints found!</p>
            <p className="text-sm sm:text-base text-gray-500 mt-2">Looks like everything is running smoothly. Check back later.</p>
          </div>
        )}

        {!loading && complaints.length > 0 && (
          <ul className="space-y-4">
            {complaints.map(c => {
              const isUpdating = statusUpdatingId === c._id;
              const isResolved = c.status === "resolved";
              return (
                <li
                  key={c._id}
                  className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition duration-300"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                    <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                      <p className="text-lg sm:text-xl font-bold text-gray-900 truncate">{c.title}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.description}</p>
                    </div>

                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase rounded-full ring-1 ring-inset sm:ml-4 shrink-0 w-fit ${getStatusClasses(c.status)}`}
                    >
                      {getStatusIcon(c.status)}
                      {c.status.replace(/-/g, ' ')}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-gray-100 mt-3 space-y-3 sm:space-y-0">
                    <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="font-medium text-gray-700">Tenant: {c.userId?.name || c.userId?.email || 'Unknown'}</span>
                      {c.category && <span>Category: {c.category}</span>}
                    </div>

                    <div className="flex space-x-2 items-center w-full sm:w-auto">
                      
                      {c.status !== "in-progress" && !isResolved && (
                        <button
                          onClick={() => changeStatus(c._id, "in-progress")}
                          disabled={isUpdating}
                          className="flex items-center justify-center text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition duration-150 disabled:opacity-50 w-1/2 sm:w-auto"
                        >
                          {isUpdating && statusUpdatingId === c._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Work"}
                        </button>
                      )}

                      {!isResolved && (
                        <button
                          onClick={() => changeStatus(c._id, "resolved")}
                          disabled={isUpdating}
                          className="flex items-center justify-center text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition duration-150 disabled:opacity-50 shadow-md w-full sm:w-auto"
                        >
                          {isUpdating && statusUpdatingId === c._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark Resolved"}
                        </button>
                      )}
                      
                      {isResolved && (
                          <span className="text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-green-700 bg-white border border-green-200 w-full text-center sm:w-auto">
                            Completed
                          </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}