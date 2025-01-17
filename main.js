const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const candidateRoutes = require('./routes/candidates');

const app = express();
const PORT = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// CONNECT TO DATABASE
connectDB();

// ROUTES
app.use('/candidates', candidateRoutes);



// START SERVER
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));