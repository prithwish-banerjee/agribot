const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const aiRoutes = require('./routes/aiRoutes');
const scanRoutes = require('./routes/scanRoutes');
const ttsRoute = require('./routes/Ttsroute');

app.use('/auth', authRoutes);
app.use('/logs', logRoutes);
app.use('/ai', aiRoutes);
app.use('/scan', scanRoutes);
app.use('/api', ttsRoute);

// ✅ Start server after DB connects
sequelize.sync().then(() => {
    console.log("✅ Database connected & synced");
    app.listen(5000, () => {
        console.log("🚀 Server running on http://localhost:5000");
    });
}).catch(err => {
    console.error("❌ DB connection failed:", err);
});