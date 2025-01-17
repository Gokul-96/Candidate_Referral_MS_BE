const express = require('express');
const multer = require('multer');
const Candidate = require('../models/Candidate');

const router = express.Router();

// MULTER CONFIGURATION
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed!'));
  },
});

// ROUTES
// GET ALL CANDIDATES
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST A NEW CANDIDATE
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, jobTitle } = req.body;
    const resume = req.file ? req.file.path : null;
    const candidate = new Candidate({ name, email, phone, jobTitle, resume });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE CANDIDATE STATUS
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE A CANDIDATE (OPTIONAL)
router.delete('/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;