import mongoose from "mongoose"

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  targetDate: { type: Date, required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
  milestones: [{ title: String, completed: Boolean, date: Date }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Goal", goalSchema)
