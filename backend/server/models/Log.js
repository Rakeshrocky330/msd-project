import mongoose from "mongoose"

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  topic: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  mood: { type: String, enum: ["happy", "neutral", "sad"], default: "neutral" },
  tags: [String],
  attachments: [{ type: String }],
  urls: [String],
  isCompleted: { type: Boolean, default: false },
  linkedGoals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Goal" }],
  aiSummary: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Log", logSchema)
