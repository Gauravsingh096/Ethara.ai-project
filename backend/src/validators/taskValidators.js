const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

const taskRules = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'inprogress', 'done']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid user ID'),
];

const statusRules = [
  body('status').isIn(['todo', 'inprogress', 'done']).withMessage('Invalid status'),
];

module.exports = { validate, taskRules, statusRules };
