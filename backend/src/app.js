require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const pushRoutes = require("./routes/push.routes");
const tasksRoutes = require("./routes/tasks.routes");
const requestRoutes = require("./routes/request.routes");
const escrowRoutes = require("./routes/escrow.routes");

const app = express();

// ✅ 1. STATIC FILES FIRST (THIS FIXES THE 404)
app.use(express.static(path.join(__dirname)));

// ✅ 2. MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ 3. LOGGER (OPTIONAL)
app.use((req, res, next) => {
  console.log(`➡️ Incoming request: ${req.method} ${req.url}`);
  next();
});

// ✅ 4. ROUTES
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/rental-requests', require('./routes/rentalRequests.routes'));
app.use('/api/leads', require('./routes/leads.routes'));
app.use('/api/leads', require('./routes/leadImages.routes'));
app.use('/api/leads', require('./routes/leadAcceptance.routes'));
app.use('/api/notifications', require('./routes/notifications.routes'));
app.use('/api/escrow', require('./routes/escrow.routes'));
app.use('/api/tasks', require('./routes/tasks.routes'));
// Admin – escrow decisions
app.use('/api/admin/escrow', require('./routes/adminEscrow.routes'));
app.use('/api/admin', require('./routes/adminDashboard.routes'));
// Task operations//.routes'));
app.use('/api/admin', require('./routes/adminPayouts.routes'));
app.use('/api/admin', require('./routes/adminFinance.routes'));
// Finder self‑service
app.use('/api/my', require('./routes/finderPayouts.routes'));
app.use("/api/push", pushRoutes);

app.use("/api/tasks", tasksRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/escrow", escrowRoutes);


// ✅ 5. HEALTH
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'RentFinder API running' });
});

// ✅ START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
  console.log("✅ BACKEND PUBLIC KEY:", process.env.VAPID_PUBLIC_KEY);
});


