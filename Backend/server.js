const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

require('./models/User');
require('./models/Log');
const authRoutes = require('./routes/authRoutes');

const app = express();

// CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Krishi Mitra Backend Running');
});

// DB
sequelize.sync()
.then(() => console.log("MySQL Connected"))
.catch(err => console.log(err));

// Server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
// Log Routes
const logRoutes = require('./routes/logRoutes');
app.use('/logs', logRoutes);
// Scan Routes
const scanRoutes = require('./routes/scanRoutes');
app.use('/scan', scanRoutes);
//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 
const aiRoutes = require('./routes/aiRoutes'); // path may differ
app.use('/ai', aiRoutes);  // ✅ this makes /ai/chat work

// Add these lines in your server.js alongside your other routes:

const ttsRoute = require('./routes/ttsRoute');
app.use('/api', ttsRoute);

// Your existing route:
// const aiRoutes = require('./routes/aiRoutes');
// app.use('/api', aiRoutes);