const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

const projectRules = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').optional().trim(),
  body('color').optional().isHexColor().withMessage('Invalid color format'),
];

const memberRules = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Role must be admin or member'),
];

module.exports = { validate, projectRules, memberRules };
