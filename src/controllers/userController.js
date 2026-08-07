const prisma = require('../prismaClient');

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;
  try {
    // Update user fields and linked platforms if provided
    const updateData = {};
    const allowed = ['name','ageGroup','pace','resilience','distraction','status','archetype','track'];
    for (const key of allowed) if (data[key] !== undefined) updateData[key] = data[key];

    const user = await prisma.user.update({ where: { id: userId }, data: updateData });

    if (data.linkedPlatforms) {
      const lp = data.linkedPlatforms;
      await prisma.linkedPlatforms.upsert({
        where: { userId },
        update: lp,
        create: { userId, ...lp }
      });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { updateProfile };
