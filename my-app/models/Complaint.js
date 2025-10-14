import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "general" },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
      set: (v) => v.toLowerCase(),
    },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
