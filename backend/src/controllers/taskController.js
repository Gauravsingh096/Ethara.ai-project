const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;
    const { projectId } = req.params;

    if (assignedTo) {
      const isMember = req.project.members.some((m) => m.user.toString() === assignedTo);
      if (!isMember) {
        return res.status(400).json({ message: 'Assigned user is not a project member' });
      }
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo: assignedTo || null,
      project: projectId,
      createdBy: req.user._id,
    });

    await task.populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignedTo } = req.query;

    const filter = { project: projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.params.projectId,
    })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.params.projectId,
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isAdmin = req.projectRole === 'admin';
    const isAssigned =
      task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (!isAdmin) {
      const { status } = req.body;
      task.status = status;
    } else {
      const { title, description, priority, status, dueDate, assignedTo } = req.body;
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (priority !== undefined) task.priority = priority;
      if (status !== undefined) task.status = status;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (assignedTo !== undefined) {
        if (assignedTo) {
          const isMember = req.project.members.some((m) => m.user.toString() === assignedTo);
          if (!isMember) {
            return res.status(400).json({ message: 'Assigned user is not a project member' });
          }
        }
        task.assignedTo = assignedTo || null;
      }
    }

    await task.save();
    await task.populate([
      { path: 'assignedTo', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      project: req.params.projectId,
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
