import express from "express"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import User from "../models/User.js"
import PasswordReset from "../models/PasswordReset.js"
import EmailVerification from "../models/EmailVerification.js"
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/emailService.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const user = new User({ name, email, password })
    await user.save()

    // Create email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const emailVerification = new EmailVerification({
      userId: user._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    await emailVerification.save()

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, verified: false },
      message: "Registration successful. Please verify your email.",
    })
  } catch (error) {
    console.error("Error in /api/auth/register:", error)
    res.status(500).json({ message: error.message })
  }
})

router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body

    const verification = await EmailVerification.findOne({ token })
    if (!verification || verification.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired verification token" })
    }

    await User.findByIdAndUpdate(verification.userId, { emailVerified: true })
    await EmailVerification.deleteOne({ _id: verification._id })

    res.json({ message: "Email verified successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, verified: user.emailVerified },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const passwordReset = new PasswordReset({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })
    await passwordReset.save()

    await sendPasswordResetEmail(email, resetToken)

    res.json({ message: "Password reset link sent to your email" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body

    const passwordReset = await PasswordReset.findOne({ token })
    if (!passwordReset || passwordReset.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired reset token" })
    }

    const user = await User.findById(passwordReset.userId)
    user.password = newPassword
    await user.save()

    await PasswordReset.deleteOne({ _id: passwordReset._id })

    res.json({ message: "Password reset successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/change-password", async (req, res) => {
  try {
    const { userId } = req.body
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(userId)
    const isPasswordValid = await user.comparePassword(currentPassword)
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    user.password = newPassword
    await user.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
