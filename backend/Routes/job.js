const express = require("express");
const router = express.Router();
const Job = require("../Model/Job");
const { authMiddleware } = require("./auth");

// Protected route - require admin authentication for creating jobs
router.post("/", authMiddleware(['admin']), async (req, res) => {
  try {
    const jobdata = new Job({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      Experience: req.body.Experience,
      category: req.body.category,
      aboutCompany: req.body.aboutCompany,
      aboutJob: req.body.aboutJob,
      whoCanApply: req.body.whoCanApply,
      perks: req.body.perks,
      AdditionalInfo: req.body.AdditionalInfo,
      CTC: req.body.CTC,
      StartDate: req.body.StartDate,
    });
    
    const data = await jobdata.save();
    res.status(201).json(data);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// Public routes - anyone can view jobs
router.get("/", async (req, res) => {
  try {
    const data = await Job.find();
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch jobs error:', error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Job.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch job by ID error:', error);
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

module.exports = router;