import mongoose from "mongoose"

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: String,
    proficiency: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    hoursSpent: {
      type: Number,
      default: 0,
    },
    endorsements: {
      type: Number,
      default: 0,
    },
    lastPracticed: Date,
  },
  { timestamps: true },
)

export default mongoose.models.Skill || mongoose.model("Skill", skillSchema)
