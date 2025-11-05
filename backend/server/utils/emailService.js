import nodemailer from "nodemailer"

let transporter = null
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  } else {
    console.warn("Email credentials not provided; emails will be skipped")
  }
} catch (e) {
  console.warn("Failed to create email transporter", e)
  transporter = null
}

const safeSend = async (mailOptions) => {
  if (!transporter) {
    console.info("Skipping sendMail (no transporter). Mail options:", mailOptions)
    return
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.warn("sendMail failed:", err.message)
    // swallow errors so email failures don't break main flows
  }
}

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
  await safeSend({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  })
}

export const sendVerificationEmail = async (email, verificationToken) => {
  const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`
  await safeSend({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Click <a href="${verifyLink}">here</a> to verify your email address.</p>`,
  })
}

export const sendWelcomeEmail = async (email, name) => {
  await safeSend({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to AI Career Tracker",
    html: `<p>Welcome ${name}! Start tracking your learning journey today.</p>`,
  })
}
