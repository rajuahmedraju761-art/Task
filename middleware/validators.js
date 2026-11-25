const { body, query, validationResult } = require("express-validator");

// ── Reusable helper ────────────────────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ── POST /api/tasks – validation rules ────────────────────────────────────────
const createTaskRules = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim(),

  body("status")
    .optional()
    .isIn(["pending", "in-progress", "done"])
    .withMessage("Status must be pending, in-progress, or done"),

  body("dueDate")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("dueDate must be a valid ISO 8601 date")
    .toDate(),

  body("userId")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("userId must be a valid MongoDB ObjectId"),
];

// ── GET /api/tasks – query validation rules ───────────────────────────────────
const getTasksRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100")
    .toInt(),

  query("status")
    .optional()
    .isIn(["pending", "in-progress", "done"])
    .withMessage("status must be pending, in-progress, or done"),
];

module.exports = { validate, createTaskRules, getTasksRules };
