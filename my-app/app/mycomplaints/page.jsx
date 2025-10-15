"use client";
import { useState, useEffect } from "react";

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setComplaints(data.complaints);
    };

    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return setMessage("You must be logged in");

    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, category }),
    });

    const data = await res.json();
    if (res.ok) {
      setComplaints((prev) => [...prev, data.complaint]);
      setMessage("Complaint added successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      setShowForm(false);
    } else {
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      <h1 className="text-3xl font-bold mb-6 text-center">My Complaints</h1>
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-10 right-10 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full text-2xl shadow-lg"
      >
        +
      </button>
      <div className="max-w-4xl mx-auto">
        {complaints.length === 0 ? (
          <p className="text-center text-gray-400 mt-20">No complaints yet.</p>
        ) : (
          complaints.map((c) => (
            <div
              key={c._id}
              className="bg-gray-900 p-4 mb-4 rounded-lg border border-gray-800"
            >
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-gray-400">{c.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Category: {c.category || "General"} | Status: {c.status}
              </p>
            </div>
          ))
        )}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">
              New Complaint
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 mb-3 rounded bg-gray-800 text-white outline-none"
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 mb-3 rounded bg-gray-800 text-white outline-none"
                rows="4"
                required
              ></textarea>

              <input
                type="text"
                placeholder="Category (optional)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 mb-3 rounded bg-gray-800 text-white outline-none"
              />

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
                >
                  Submit
                </button>
              </div>
            </form>

            {message && (
              <p className="text-center mt-3 text-sm text-green-400">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
