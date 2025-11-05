import Goal from "@/models/Goal"

export async function createGoal(userId, goalData) {
  const goal = await Goal.create({
    userId,
    ...goalData,
  })
  return goal
}

export async function getUserGoals(userId, status = null) {
  const query = { userId }
  if (status) {
    query.status = status
  }

  const goals = await Goal.find(query).sort({ createdAt: -1 })
  return goals
}

export async function updateGoal(goalId, userId, updates) {
  const goal = await Goal.findOne({ _id: goalId, userId })
  if (!goal) {
    throw new Error("Goal not found")
  }

  Object.assign(goal, updates)
  await goal.save()
  return goal
}

export async function deleteGoal(goalId, userId) {
  const goal = await Goal.findOneAndDelete({ _id: goalId, userId })
  if (!goal) {
    throw new Error("Goal not found")
  }
  return goal
}

export async function updateGoalProgress(goalId, userId, progress) {
  const goal = await Goal.findOne({ _id: goalId, userId })
  if (!goal) {
    throw new Error("Goal not found")
  }

  goal.progress = Math.min(progress, 100)
  if (goal.progress === 100) {
    goal.status = "completed"
    goal.completedAt = new Date()
  }

  await goal.save()
  return goal
}
