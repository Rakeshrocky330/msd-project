import Notification from "../models/Notification.js"

export async function createNotification(userId, type, title, message, actionUrl = null) {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      actionUrl,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

export async function getUserNotifications(userId, limit = 50, skip = 0) {
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Notification.countDocuments({ userId })
    const unreadCount = await Notification.countDocuments({ userId, read: false })

    return { notifications, total, unreadCount, hasMore: skip + limit < total }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    return await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export async function markAllNotificationsAsRead(userId) {
  try {
    return await Notification.updateMany({ userId, read: false }, { read: true })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

export async function deleteNotification(notificationId) {
  try {
    return await Notification.findByIdAndDelete(notificationId)
  } catch (error) {
    console.error("Error deleting notification:", error)
    throw error
  }
}

export async function clearAllNotifications(userId) {
  try {
    return await Notification.deleteMany({ userId })
  } catch (error) {
    console.error("Error clearing notifications:", error)
    throw error
  }
}

export async function getUnreadCount(userId) {
  try {
    return await Notification.countDocuments({ userId, read: false })
  } catch (error) {
    console.error("Error getting unread count:", error)
    throw error
  }
}
