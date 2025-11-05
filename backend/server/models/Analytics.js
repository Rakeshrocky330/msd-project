import mongoose from "mongoose"

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  totalLearningHours: {
    type: Number,
    default: 0,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  logsCreated: {
    type: Number,
    default: 0,
  },
  goalsCompleted: {
    type: Number,
    default: 0,
  },
  skillsAdded: {
    type: Number,
    default: 0,
  },
  weeklyData: [
    {
      date: Date,
      hoursLogged: Number,
      logsCount: Number,
    },
  ],
  monthlyData: [
    {
      month: String,
      hoursLogged: Number,
      logsCount: Number,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

analyticsSchema.index({ userId: 1 })
analyticsSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.model("Analytics", analyticsSchema)
