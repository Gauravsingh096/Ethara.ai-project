const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { requireProjectRole } = require('../middleware/role');
const { validate, projectRules, memberRules } = require('../validators/projectValidators');
const { validate: validateTask, taskRules, statusRules } = require('../validators/taskValidators');

router.use(protect);

router.get('/search-users', projectController.searchUsers);

router.route('/')
  .get(projectController.getProjects)
  .post(projectRules, validate, projectController.createProject);

router.route('/:projectId')
  .get(projectController.getProject)
  .put(requireProjectRole('admin'), projectRules, validate, projectController.updateProject)
  .delete(requireProjectRole('admin'), projectController.deleteProject);

router.post('/:projectId/members', requireProjectRole('admin'), memberRules, validate, projectController.addMember);
router.delete('/:projectId/members/:userId', requireProjectRole('admin'), projectController.removeMember);

router.route('/:projectId/tasks')
  .get(requireProjectRole(), taskController.getTasks)
  .post(requireProjectRole('admin'), taskRules, validateTask, taskController.createTask);

router.route('/:projectId/tasks/:taskId')
  .get(requireProjectRole(), taskController.getTask)
  .put(requireProjectRole(), taskRules, validateTask, taskController.updateTask)
  .delete(requireProjectRole('admin'), taskController.deleteTask);

module.exports = router;
