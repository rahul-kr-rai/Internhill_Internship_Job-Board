// server/routes/presign.js
const express = require('express');
const AWS = require('aws-sdk');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const logger = require('../logger');

const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || 'ap-south-1'
});

// Request: { fileName: string, fileType: string }
// Returns: { url, key }
router.post('/s3', auth.verifyToken, [
  body('fileName').isString().notEmpty(),
  body('fileType').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Invalid input', errors: errors.array() });

  const { fileName, fileType } = req.body;
  const key = `resumes/${Date.now()}-${req.user.id}-${fileName.replace(/\s/g, '-')}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: 60, // seconds
    ContentType: fileType,
    ACL: 'private'
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    res.json({ url, key });
  } catch (err) {
    logger.error('Presign error', err);
    res.status(500).json({ message: 'Failed to create presigned url' });
  }
});

module.exports = router;
