import mongoose from "mongoose"

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["login", "log_created", "goal_completed", "skill_added", "portfolio_updated", "email_sent"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  data: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
})

activitySchema.index({ userId: 1, timestamp: -1 })

export default mongoose.model("Activity", activitySchema)
