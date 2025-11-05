import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["achievement", "milestone", "reminder", "system", "social"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  actionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: Date,
})

notificationSchema.index({ userId: 1, createdAt: -1 })
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model("Notification", notificationSchema)
