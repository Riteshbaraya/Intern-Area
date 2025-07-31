const express = require("express");
const router = express.Router();
const { authMiddleware } = require("./auth");
const User = require('../Model/User');
const Job = require('../Model/Job');
const Internship = require('../Model/Internship');
const Application = require('../Model/Application');

// Protected admin login route (requires JWT token)
router.post("/adminlogin", authMiddleware(['admin']), (req, res) => {
  res.status(200).json({ message: "Admin access granted" });
});

// Get admin dashboard data with real statistics
router.get("/dashboard", authMiddleware(['admin']), async (req, res) => {
  try {
    // Get real statistics from database
    const [totalJobs, totalInternships, totalApplications, totalUsers] = await Promise.all([
      Job.countDocuments(),
      Internship.countDocuments(),
      Application.countDocuments(),
      User.countDocuments()
    ]);

    res.json({ 
      message: "Admin dashboard", 
      user: req.user,
      stats: {
        totalJobs,
        totalInternships,
        totalApplications,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: "Failed to fetch dashboard stats", 
      error: error.message 
    });
  }
});

// Get all users (for admin stats)
router.get('/user', authMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

module.exports = router;
