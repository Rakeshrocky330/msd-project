import dbConnect from "@/lib/mongodb"
import { registerUser } from "@/lib/controllers/authController"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    await dbConnect()
    const { name, email, password, confirmPassword } = await request.json()

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    const result = await registerUser(name, email, password)

    return NextResponse.json(
      {
        message: "User registered successfully",
        token: result.token,
        user: result.user,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
