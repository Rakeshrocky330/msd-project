// Simple NLP service for tag extraction and text analysis
export const extractTags = (text) => {
  const keywords = [
    "react",
    "javascript",
    "python",
    "node",
    "database",
    "api",
    "frontend",
    "backend",
    "fullstack",
    "web",
    "mobile",
    "devops",
    "testing",
    "deployment",
    "docker",
    "kubernetes",
    "aws",
    "git",
    "agile",
    "design",
    "ux",
    "ui",
    "typescript",
    "sql",
    "nosql",
    "mongodb",
    "postgresql",
    "redis",
    "graphql",
    "rest",
  ]

  const lowerText = text.toLowerCase()
  const foundTags = keywords.filter((keyword) => lowerText.includes(keyword))
  return [...new Set(foundTags)]
}

export const generateSummary = (text) => {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const summaryLength = Math.max(1, Math.ceil(sentences.length / 3))
  const summary = sentences.slice(0, summaryLength).join(". ") + "."
  return summary.substring(0, 200)
}

export const getRecommendations = (skills, logs) => {
  const skillNames = skills.map((s) => s.name.toLowerCase())
  const recommendations = []

  const skillMap = {
    react: "Next.js",
    javascript: "TypeScript",
    python: "Django",
    node: "Express.js",
    frontend: "Backend Development",
    backend: "System Design",
    testing: "CI/CD",
    docker: "Kubernetes",
    sql: "NoSQL",
  }

  skillNames.forEach((skill) => {
    if (skillMap[skill]) {
      recommendations.push({
        topic: skillMap[skill],
        reason: `Natural progression from ${skill}`,
      })
    }
  })

  return recommendations.slice(0, 3)
}
