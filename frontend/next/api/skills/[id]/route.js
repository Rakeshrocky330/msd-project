import dbConnect from "@/lib/mongodb"
import Skill from "@/models/Skill"
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

    const { proficiency, hoursSpent } = await request.json()

    const skill = await Skill.findByIdAndUpdate(
      params.id,
      { proficiency, hoursSpent, lastPracticed: new Date() },
      { new: true },
    )

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json(skill, { status: 200 })
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

    await Skill.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Skill deleted" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
