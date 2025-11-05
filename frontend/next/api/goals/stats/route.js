import dbConnect from "@/lib/mongodb"
import Goal from "@/models/Goal"
import { verifyToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    await dbConnect()
    const token = request.headers.get("authorization")?.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goals = await Goal.find({ userId: decoded.userId })
    const totalGoals = goals.length
    const completedGoals = goals.filter((g) => g.status === "completed").length
    const activeGoals = goals.filter((g) => g.status === "active").length
    const averageProgress = goals.length > 0 ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length : 0

    return NextResponse.json(
      {
        totalGoals,
        completedGoals,
        activeGoals,
        averageProgress,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
