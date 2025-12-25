require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve generated images statically
app.use('/public', express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
