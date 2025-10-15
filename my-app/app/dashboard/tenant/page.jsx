"use client";
import { useEffect, useState } from "react";
import { PlusCircle, X, Loader2, Send, FileText, CheckCircle, Wrench, Clock } from "lucide-react"; // Importing icons for a cleaner look

export default function TenantDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
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

  const fetchComplaints = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setComplaints([]);
    setIsFetching(true);

    try {
      const res = await fetch("/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
      setComplaints([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user]);

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
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setComplaints([data.complaint, ...complaints]); 
        setForm({ title: "", description: "", category: "" });
        setShowForm(false);
      } else {
        alert(data.error || "Failed to create complaint");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error submitting complaint");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto py-10">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Tenant Dashboard
          </h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setForm({ title: "", description: "", category: "" });
            }}
            className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-semibold transition duration-300 shadow-md ${
              showForm
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {showForm ? (
              <>
                <X className="w-5 h-5" /> <span>Close Form</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" /> <span>New Complaint</span>
              </>
            )}
          </button>
        </div>
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showForm ? "max-h-100 opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"
          }`}
        >
          <div className="p-6 bg-white border-1 border-indigo-200 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Submit a New Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Complaint Title (e.g., Leaky Faucet in Kitchen)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-900 placeholder-gray-500"
                required
              />
              <textarea
                placeholder="Detailed Description of the issue..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-none text-gray-900 placeholder-gray-500"
                required
              ></textarea>
              <input
                type="text"
                placeholder="Category (e.g., Plumbing, Electrical, Common Area)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full sm:w-auto space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          <FileText className="inline-block w-6 h-6 mr-2 text-indigo-600" />
          My Complaints
        </h2>
        
        {isFetching ? (
            <div className="flex justify-center items-center p-8 bg-white rounded-xl shadow-sm">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
                <p className="text-gray-500">Loading your complaints...</p>
            </div>
        ) : complaints.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">
              You haven't submitted any complaints yet. Click 'New Complaint' to report an issue.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {complaints.map((c) => (
              <li
                key={c._id}
                className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-indigo-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-semibold text-gray-900 mb-1">
                      {c.title}
                    </p>
                    <p className="text-base text-gray-600 pr-4">
                      {c.description}
                    </p>
                    {c.category && (
                        <p className="text-xs text-indigo-500 mt-2 font-medium">
                            Category: {c.category}
                        </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase rounded-full ring-1 ring-inset ml-4 shrink-0 ${getStatusClasses(c.status)}`}
                  >
                    {getStatusIcon(c.status)} 
                    {c.status.replace(/-/g, ' ')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}