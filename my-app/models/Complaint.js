import mongoose from "mongoose";

const mediaFileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },       // base64 data URL
    type: { type: String, enum: ["image", "video"], required: true },
    filename: { type: String, default: "" },
  },
  { _id: false }
);

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
    mediaFiles: { type: [mediaFileSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
