const express = require("express");
const router = express.Router();
const Internship = require("../Model/Internship");
const { authMiddleware } = require("./auth");

// Protected route - require admin authentication for creating internships
router.post("/", authMiddleware(['admin']), async (req, res) => {
  try {
    const Internshipdata = new Internship({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      category: req.body.category,
      aboutCompany: req.body.aboutCompany,
      aboutInternship: req.body.aboutInternship,
      whoCanApply: req.body.whoCanApply,
      perks: req.body.perks,
      numberOfOpening: req.body.numberOfOpening,
      stipend: req.body.stipend,
      startDate: req.body.startDate,
      additionalInfo: req.body.additionalInfo,
    });
    
    const data = await Internshipdata.save();
    res.status(201).json(data);
  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({ error: "Failed to create internship" });
  }
});

// Public routes - anyone can view internships
router.get("/", async (req, res) => {
  try {
    const data = await Internship.find();
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch internships error:', error);
    res.status(500).json({ error: "Failed to fetch internships" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Internship.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Internship not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch internship by ID error:', error);
    res.status(500).json({ error: "Failed to fetch internship" });
  }
});

module.exports = router;
