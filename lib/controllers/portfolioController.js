import Portfolio from "@/models/Portfolio"
import User from "@/models/User"

export async function createOrUpdatePortfolio(userId, portfolioData) {
  let portfolio = await Portfolio.findOne({ userId })

  if (portfolio) {
    Object.assign(portfolio, portfolioData)
    await portfolio.save()
  } else {
    portfolio = await Portfolio.create({
      userId,
      ...portfolioData,
    })
  }

  return portfolio
}

export async function getUserPortfolio(userId) {
  const portfolio = await Portfolio.findOne({ userId }).populate("userId", "name email avatar")
  return portfolio
}

export async function getPublicPortfolio(username) {
  const user = await User.findOne({ name: username })
  if (!user) {
    throw new Error("User not found")
  }

  const portfolio = await Portfolio.findOne({ userId: user._id })
  return portfolio
}

export async function updatePortfolioVisibility(userId, isPublic) {
  const portfolio = await Portfolio.findOne({ userId })
  if (!portfolio) {
    throw new Error("Portfolio not found")
  }

  portfolio.isPublic = isPublic
  await portfolio.save()
  return portfolio
}
