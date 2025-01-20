const mongoose = require('mongoose');

//schema created I mean created structure and then email and phone number validate using  match in mongoose schemas
const candidateSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  email: {type : String, required: true,  match: /.+\@.+\..+/},
  phoneNumber: {type : String, required: true,  match: /^[0-9]{10}$/},
  jobTitle: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  resume: { type: String },
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;