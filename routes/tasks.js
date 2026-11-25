const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const {
  validate,
  createTaskRules,
  getTasksRules,
} = require("../middleware/validators");

router.post("/", createTaskRules, validate, async (req, res) => {
  try {
    const { title, status, dueDate, userId } = req.body;

    const task = await Task.create({ title, status, dueDate, userId });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    // Mongoose validation errors (e.g. enum violation via model layer)
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    console.error("POST /api/tasks error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/", getTasksRules, validate, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Run count and find in parallel for efficiency
    const [total, tasks] = await Promise.all([
      Task.countDocuments(filter),
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      data: tasks,
    });
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
