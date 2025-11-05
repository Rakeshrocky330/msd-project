import mongoose from "mongoose"

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    headline: String,
    bio: String,
    profileImage: String,
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      website: String,
    },
    projects: [
      {
        title: String,
        description: String,
        link: String,
        image: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: Date,
        credentialUrl: String,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema)
