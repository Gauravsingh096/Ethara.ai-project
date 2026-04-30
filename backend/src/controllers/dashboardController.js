const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({ 'members.user': userId }).select('_id name');
    const projectIds = projects.map((p) => p._id);

    const [tasksByStatus, tasksByUser, overdueTasks, totalTasks] = await Promise.all([
      Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { project: { $in: projectIds }, assignedTo: { $ne: null } } },
        {
          $group: {
            _id: '$assignedTo',
            count: { $sum: 1 },
            done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        { $project: { count: 1, done: 1, 'user.name': 1, 'user.email': 1, 'user.avatar': 1 } },
      ]),
      Task.countDocuments({
        project: { $in: projectIds },
        dueDate: { $lt: new Date() },
        status: { $ne: 'done' },
      }),
      Task.countDocuments({ project: { $in: projectIds } }),
    ]);

    const statusMap = { todo: 0, inprogress: 0, done: 0 };
    tasksByStatus.forEach(({ _id, count }) => {
      statusMap[_id] = count;
    });

    res.json({
      totalTasks,
      tasksByStatus: statusMap,
      tasksByUser,
      overdueTasks,
      projectCount: projects.length,
    });
  } catch (err) {
    next(err);
  }
};
