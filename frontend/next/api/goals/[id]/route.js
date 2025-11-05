import dbConnect from "@/lib/mongodb"
import { updateGoal, deleteGoal } from "@/lib/controllers/goalController"
import { verifyToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function PATCH(request, { params }) {
  try {
    await dbConnect()
    const token = request.headers.get("authorization")?.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()
    const goal = await updateGoal(params.id, decoded.userId, updates)

    return NextResponse.json(goal, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const token = request.headers.get("authorization")?.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteGoal(params.id, decoded.userId)
    return NextResponse.json({ message: "Goal deleted" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
