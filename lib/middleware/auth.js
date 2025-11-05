import { verifyToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export function withAuth(handler) {
  return async (request) => {
    try {
      const token = request.headers.get("authorization")?.split(" ")[1]
      const decoded = verifyToken(token)

      if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      request.userId = decoded.userId
      return handler(request)
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}
