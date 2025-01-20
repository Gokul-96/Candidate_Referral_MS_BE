const express = require('express');
const multer = require('multer');
const Candidate = require('../models/Candidate');

const router = express.Router();

// MULTER CONFIGURATION check google
const fs = require('fs');


// Ensure the directory exists
const uploadDir = 'C:\Users\krish\Desktop\Resume ATS friendly\Gokulakrishnan_Resume_07102024';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); 
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf'); // Add a .pdf extension
  },
});

const upload = multer({ storage: storage });


// ROUTES


// POST A NEW CANDIDATE, upload.single('resume') - process uploaded file
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { candidateName, email, phoneNumber, jobTitle } = req.body;
    const resume = req.file ? req.file.path : null;
    const candidate = new Candidate({ candidateName, email, phoneNumber, jobTitle, resume });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET ALL CANDIDATES

//fetch all candidates and using find to filter but here fetch all
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);  //here ,return as json 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE CANDIDATE STATUS
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
      const updatedCandidate = await Candidate.findByIdAndUpdate(
          id,
          { status },
          { new: true } // Return the updated document
      );
      if (!updatedCandidate) {
          return res.status(404).json({ error: 'Candidate not found' });
      }
      res.json(updatedCandidate);
  } catch (error) {
      res.status(500).json({ error: 'Failed to update candidate' });
  }
});
// DELETE A CANDIDATE
router.delete('/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;