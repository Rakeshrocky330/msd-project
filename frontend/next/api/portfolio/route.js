import dbConnect from "@/lib/mongodb"
import Portfolio from "@/models/Portfolio"
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

    let portfolio = await Portfolio.findOne({ userId: decoded.userId })

    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId: decoded.userId,
        headline: "",
        bio: "",
        socialLinks: {},
      })
    }

    return NextResponse.json(portfolio, { status: 200 })
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

    const { headline, bio, socialLinks } = await request.json()

    let portfolio = await Portfolio.findOne({ userId: decoded.userId })

    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId: decoded.userId,
        headline,
        bio,
        socialLinks,
      })
    } else {
      portfolio.headline = headline
      portfolio.bio = bio
      portfolio.socialLinks = socialLinks
      await portfolio.save()
    }

    return NextResponse.json(portfolio, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
