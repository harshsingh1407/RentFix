import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["new_complaint", "status_change"],
      required: true,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
