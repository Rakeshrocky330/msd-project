import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: null },
  role: { type: String, enum: ["user", "mentor", "admin"], default: "user" },
  timezone: { type: String, default: "UTC" },
  darkMode: { type: Boolean, default: false },
  totalLearningHours: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export default mongoose.model("User", userSchema)
