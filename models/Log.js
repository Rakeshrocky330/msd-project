import mongoose from "mongoose"

const logSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
    },
    tags: [String],
    mood: {
      type: String,
      enum: ["excellent", "good", "neutral", "bad", "terrible"],
      default: "neutral",
    },
    duration: {
      type: Number,
      default: 0,
    },
    resources: [
      {
        title: String,
        url: String,
      },
    ],
    attachments: [String],
    aiSummary: String,
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Log || mongoose.model("Log", logSchema)
