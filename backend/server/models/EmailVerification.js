import mongoose from "mongoose"

const emailVerificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // Auto-delete after 24 hours
})

export default mongoose.model("EmailVerification", emailVerificationSchema)
