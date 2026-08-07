require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const aiRoutes = require('./routes/aiRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const linkedRoutes = require('./routes/linkedRoutes');
const setupSocket = require('./socket');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Serve full web application frontend
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/linked-platforms', linkedRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = setupSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server, io };
