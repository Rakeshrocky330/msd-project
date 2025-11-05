import Skill from "@/models/Skill"

export async function createSkill(userId, skillData) {
  const skill = await Skill.create({
    userId,
    ...skillData,
  })
  return skill
}

export async function getUserSkills(userId, category = null) {
  const query = { userId }
  if (category) {
    query.category = category
  }

  const skills = await Skill.find(query).sort({ proficiency: -1 })
  return skills
}

export async function updateSkill(skillId, userId, updates) {
  const skill = await Skill.findOne({ _id: skillId, userId })
  if (!skill) {
    throw new Error("Skill not found")
  }

  Object.assign(skill, updates)
  await skill.save()
  return skill
}

export async function deleteSkill(skillId, userId) {
  const skill = await Skill.findOneAndDelete({ _id: skillId, userId })
  if (!skill) {
    throw new Error("Skill not found")
  }
  return skill
}

export async function getSkillStats(userId) {
  const skills = await Skill.find({ userId })
  const totalSkills = skills.length
  const averageProficiency = skills.length > 0 ? skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length : 0
  const categories = [...new Set(skills.map((s) => s.category))]

  return {
    totalSkills,
    averageProficiency,
    categories,
    topSkills: skills.slice(0, 5),
  }
}
