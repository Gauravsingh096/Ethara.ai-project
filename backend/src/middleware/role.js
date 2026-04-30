const Project = require('../models/Project');

const requireProjectRole = (...roles) => async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId || req.body.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member) {
      return res.status(403).json({ message: 'Not a member of this project' });
    }

    if (roles.length > 0 && !roles.includes(member.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    req.project = project;
    req.projectRole = member.role;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requireProjectRole };
