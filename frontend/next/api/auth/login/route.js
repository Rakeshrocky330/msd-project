import dbConnect from "@/lib/mongodb"
import { loginUser } from "@/lib/controllers/authController"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    await dbConnect()
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await loginUser(email, password)

    return NextResponse.json(
      {
        message: "Login successful",
        token: result.token,
        user: result.user,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}
