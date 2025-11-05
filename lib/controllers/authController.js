import User from "@/models/User"
import bcrypt from "bcryptjs"
import { generateToken } from "@/lib/auth"

export async function registerUser(name, email, password) {
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error("Email already registered")
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  const token = generateToken(user._id, user.email)
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  }
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error("Invalid email or password")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error("Invalid email or password")
  }

  user.lastLogin = new Date()
  await user.save()

  const token = generateToken(user._id, user.email)
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    token,
  }
}

export async function updateUserProfile(userId, updates) {
  const user = await User.findByIdAndUpdate(userId, updates, { new: true })
  return user
}

export async function getUserProfile(userId) {
  const user = await User.findById(userId).select("-password")
  return user
}
