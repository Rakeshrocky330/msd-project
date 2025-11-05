"use client"

import "../styles/StreakCalendar.css"

export default function StreakCalendar({ logs }) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Create activity map
  const activityMap = {}
  logs.forEach((log) => {
    const date = new Date(log.createdAt).toLocaleDateString()
    activityMap[date] = (activityMap[date] || 0) + 1
  })

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getActivityLevel = (day) => {
    if (!day) return 0
    const date = new Date(currentYear, currentMonth, day).toLocaleDateString()
    const count = activityMap[date] || 0
    if (count === 0) return 0
    if (count === 1) return 1
    if (count <= 2) return 2
    return 3
  }

  return (
    <div className="streak-calendar">
      <h3>Activity Heatmap</h3>
      <div className="calendar-header">
        <h4>{new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h4>
      </div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`calendar-day activity-level-${getActivityLevel(day)}`}
            title={
              day
                ? `${day} logs: ${activityMap[new Date(currentYear, currentMonth, day).toLocaleDateString()] || 0}`
                : ""
            }
          >
            {day}
          </div>
        ))}
      </div>
      <div className="activity-legend">
        <span className="legend-item">
          <span className="legend-box activity-level-0"></span> No activity
        </span>
        <span className="legend-item">
          <span className="legend-box activity-level-1"></span> 1 log
        </span>
        <span className="legend-item">
          <span className="legend-box activity-level-2"></span> 2 logs
        </span>
        <span className="legend-item">
          <span className="legend-box activity-level-3"></span> 3+ logs
        </span>
      </div>
    </div>
  )
}
