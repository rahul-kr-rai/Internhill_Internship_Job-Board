const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String }, // file path
  coverLetter: { type: String },
  status: { 
    type: String, 
    enum: ['Applied', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected'], 
    default: 'Applied' 
  },
  feedback: { type: String }, // employer feedback
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
