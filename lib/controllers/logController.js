import Log from "@/models/Log"

export async function createLog(userId, logData) {
  const log = await Log.create({
    userId,
    ...logData,
  })
  return log
}

export async function getUserLogs(userId, filters = {}) {
  const query = { userId }

  if (filters.topic) {
    query.topic = filters.topic
  }
  if (filters.mood) {
    query.mood = filters.mood
  }
  if (filters.startDate && filters.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    }
  }

  const logs = await Log.find(query).sort({ createdAt: -1 })
  return logs
}

export async function updateLog(logId, userId, updates) {
  const log = await Log.findOne({ _id: logId, userId })
  if (!log) {
    throw new Error("Log not found")
  }

  Object.assign(log, updates)
  await log.save()
  return log
}

export async function deleteLog(logId, userId) {
  const log = await Log.findOneAndDelete({ _id: logId, userId })
  if (!log) {
    throw new Error("Log not found")
  }
  return log
}

export async function getLogStats(userId) {
  const logs = await Log.find({ userId })
  const totalLogs = logs.length
  const totalHours = logs.reduce((sum, log) => sum + (log.duration || 0), 0)
  const topics = [...new Set(logs.map((log) => log.topic))]
  const moods = logs.map((log) => log.mood)

  return {
    totalLogs,
    totalHours,
    topics,
    averageMood: moods.length > 0 ? moods.reduce((a, b) => a + b) / moods.length : 0,
  }
}
