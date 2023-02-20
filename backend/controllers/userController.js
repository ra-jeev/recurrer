const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { appDb } = require('../db/conn');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  const usersCollection = appDb().collection('users');
  const userExists = await usersCollection.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error('User already exists. Please login.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const date = new Date();
  const insertRes = await usersCollection.insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: date,
    updatedAt: date,
  });

  if (insertRes.insertedId) {
    res.status(201).json({
      _id: insertRes.insertedId,
      name,
      email,
      token: generateToken(insertRes.insertedId),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await appDb().collection('users').findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
