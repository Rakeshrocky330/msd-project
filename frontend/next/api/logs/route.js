import dbConnect from "@/lib/mongodb"
import { createLog, getUserLogs } from "@/lib/controllers/logController"
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
    const filters = {
      topic: searchParams.get("topic"),
      mood: searchParams.get("mood"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
    }

    const logs = await getUserLogs(decoded.userId, filters)
    return NextResponse.json(logs, { status: 200 })
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

    const logData = await request.json()
    const log = await createLog(decoded.userId, logData)

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
