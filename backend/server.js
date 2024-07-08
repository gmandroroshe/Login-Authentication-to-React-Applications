const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret in a real application

mongoose.connect('mongodb://localhost:27017/auth-example', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.send('User registered successfully');
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('User not found');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.json({ token, user: { id: user._id, email: user.email } });
});

const auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Access denied');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

app.get('/api/protected', auth, (req, res) => {
  res.send('This is a protected route');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
