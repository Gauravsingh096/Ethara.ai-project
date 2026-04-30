const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

exports.createProject = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    const project = await Project.create({
      name,
      description,
      color,
      creator: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });

    await project.populate('members.user', 'name email avatar');
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('members.user', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('members.user', 'name email avatar')
      .populate('creator', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(
      (m) => m.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) return res.status(403).json({ message: 'Not a member of this project' });

    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { name, description, color },
      { new: true, runValidators: true }
    ).populate('members.user', 'name email avatar');

    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await Task.deleteMany({ project: req.params.projectId });
    await Project.findByIdAndDelete(req.params.projectId);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { userId, role = 'member' } = req.body;
    const project = req.project;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyMember = project.members.some((m) => m.user.toString() === userId);
    if (alreadyMember) return res.status(409).json({ message: 'User already a member' });

    project.members.push({ user: userId, role });
    await project.save();
    await project.populate('members.user', 'name email avatar');

    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const project = req.project;

    if (userId === project.creator.toString()) {
      return res.status(400).json({ message: 'Cannot remove project creator' });
    }

    project.members = project.members.filter((m) => m.user.toString() !== userId);
    await project.save();
    await project.populate('members.user', 'name email avatar');

    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name email avatar')
      .limit(10);

    res.json(users);
  } catch (err) {
    next(err);
  }
};
