import mongoose from "mongoose"

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "My Learning Portfolio" },
  bio: { type: String, default: "" },
  isPublic: { type: Boolean, default: false },
  shareToken: { type: String, unique: true, sparse: true },
  featuredSkills: [String],
  featuredProjects: [String],
  certifications: [
    {
      name: String,
      issuer: String,
      date: Date,
      url: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Portfolio", portfolioSchema)
