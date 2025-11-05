import dbConnect from "@/lib/mongodb"
import { createGoal, getUserGoals } from "@/lib/controllers/goalController"
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const goals = await getUserGoals(decoded.userId, status)
    return NextResponse.json(goals, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const token = request.headers.get("authorization")?.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const goalData = await request.json()
    const goal = await createGoal(decoded.userId, goalData)

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
