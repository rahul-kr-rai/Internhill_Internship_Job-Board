const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');

const router = express.Router();

// Get my applications (jobseeker)
router.get('/my-applications', protect, authorize('jobseeker'), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location type salary description')
      .sort({ appliedAt: -1 });
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply for a job with file upload
router.post('/', protect, authorize('jobseeker'), upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resume: req.file ? req.file.path : null
    });

    // Add application to job
    job.applications.push(application._id);
    await job.save();

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get applications for a job (employer)
router.get('/job/:jobId', protect, authorize('employer'), async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email')
      .populate('job', 'title company')
      .sort({ appliedAt: -1 });
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all applications for employer's jobs
router.get('/employer/all-applications', protect, authorize('employer'), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    const jobIds = jobs.map(j => j._id);
    
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'name email')
      .populate('job', 'title company')
      .sort({ appliedAt: -1 });
    
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update application status + feedback (employer)
router.put('/:id', protect, authorize('employer'), async (req, res) => {
  try {
    const { status, feedback } = req.body;

    if (!['Applied', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, feedback, updatedAt: new Date() },
      { new: true }
    ).populate('applicant', 'name email').populate('job', 'title company');

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download resume
router.get('/resume/:filename', protect, (req, res) => {
  try {
    const file = path.join(__dirname, '../uploads/resumes/', req.params.filename);
    res.download(file);
  } catch (err) {
    res.status(404).json({ message: 'Resume not found' });
  }
});

module.exports = router;
