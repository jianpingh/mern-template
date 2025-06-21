const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors()); // 添加这一行以启用CORS

// MongoDB connection
mongoose.connect('mongodb://admin:123456@47.98.120.26:27017/admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const swaggerSetup = require('./swagger');

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Swagger documentation
swaggerSetup(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
