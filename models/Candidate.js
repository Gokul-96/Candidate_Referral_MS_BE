const mongoose = require('mongoose');


const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  jobTitle: String,
  status: { type: String, default: 'Pending' },
  resume: String,
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;