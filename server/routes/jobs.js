const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'name company');
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get employer's jobs (BEFORE /:id route)
router.get('/employer/my-jobs', protect, authorize('employer'), async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name company');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create job (employer only)
router.post('/', protect, authorize('employer'), async (req, res) => {
  try {
    const { title, location, type, salary, description } = req.body;

    if (!title || !location || !type || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const employer = await User.findById(req.user.id);
    if (!employer) return res.status(404).json({ message: 'Employer not found' });

    const job = await Job.create({
      title,
      location,
      type,
      salary,
      description,
      company: employer.company || employer.name,
      employer: req.user.id
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update job
router.put('/:id', protect, authorize('employer'), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete job
router.delete('/:id', protect, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;