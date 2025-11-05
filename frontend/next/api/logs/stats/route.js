import dbConnect from "@/lib/mongodb"
import { getLogStats } from "@/lib/controllers/logController"
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

    const stats = await getLogStats(decoded.userId)
    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
