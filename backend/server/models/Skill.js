import mongoose from "mongoose"

const skillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { type: String, default: "General" },
  selfRating: { type: Number, min: 1, max: 5, default: 1 },
  aiRating: { type: Number, min: 1, max: 5, default: null },
  hoursSpent: { type: Number, default: 0 },
  lastPracticed: { type: Date, default: Date.now },
  decayRate: { type: Number, default: 0 }, // skill decay percentage
  badges: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Skill", skillSchema)
