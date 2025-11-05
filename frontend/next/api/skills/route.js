import dbConnect from "@/lib/mongodb"
import Skill from "@/models/Skill"
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

    const skills = await Skill.find({ userId: decoded.userId }).sort({ createdAt: -1 })
    return NextResponse.json(skills, { status: 200 })
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

    const { name, category, proficiency } = await request.json()

    const skill = await Skill.create({
      userId: decoded.userId,
      name,
      category,
      proficiency,
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
