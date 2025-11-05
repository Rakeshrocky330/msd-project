import mongoose from "mongoose"

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: String,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    targetDate: Date,
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    milestones: [
      {
        title: String,
        completed: Boolean,
        dueDate: Date,
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.Goal || mongoose.model("Goal", goalSchema)
