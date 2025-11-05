import Activity from "../models/Activity.js"
import User from "../models/User.js"

export async function createActivity(userId, type, title, description, data = {}) {
  try {
    const activity = await Activity.create({
      userId,
      type,
      title,
      description,
      data,
    })
    return activity
  } catch (error) {
    console.error("Error creating activity:", error)
    throw error
  }
}

export async function getUserActivities(userId, limit = 20, skip = 0) {
  try {
    const activities = await Activity.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Activity.countDocuments({ userId })

    return { activities, total, hasMore: skip + limit < total }
  } catch (error) {
    console.error("Error fetching activities:", error)
    throw error
  }
}

export async function markActivityAsRead(activityId) {
  try {
    return await Activity.findByIdAndUpdate(activityId, { read: true }, { new: true })
  } catch (error) {
    console.error("Error marking activity as read:", error)
    throw error
  }
}

export async function markAllActivitiesAsRead(userId) {
  try {
    return await Activity.updateMany({ userId, read: false }, { read: true })
  } catch (error) {
    console.error("Error marking all activities as read:", error)
    throw error
  }
}

export async function deleteActivity(activityId) {
  try {
    return await Activity.findByIdAndDelete(activityId)
  } catch (error) {
    console.error("Error deleting activity:", error)
    throw error
  }
}

export async function getUnreadActivityCount(userId) {
  try {
    return await Activity.countDocuments({ userId, read: false })
  } catch (error) {
    console.error("Error getting unread count:", error)
    throw error
  }
}
