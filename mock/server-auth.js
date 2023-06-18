const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 8081;
app.use(express.json());

let accessToken = '';
let refreshToken = '';
let refreshTokens = [];

const expiresIn = '30s';
const secretKey = process.env.ACCESS_TOKEN_SECRET;

// Mock data for user database with multiple users and roles
const users = [
  {
    username: 'test',
    password: 'test',
    role: 'admin',
  },
  {
    username: 'admin',
    password: 'admin',
    role: 'admin',
  },
  {
    username: 'user',
    password: 'user',
    role: 'user',
  },
];

function generateTokens(user) {
  const payload = {username: user.username, role: user.role};
  const options = {expiresIn: expiresIn};
  accessToken = jwt.sign(payload, secretKey, options);
  refreshToken = jwt.sign(payload, secretKey);
}

// Route to handle user login and generate new tokens
app.post('/login', (req, res) => {
  const {username, password} = req.body;
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  generateTokens(user);

  refreshTokens.push(refreshToken);

  res.status(200).send({accessToken, refreshToken});
});

// Route to refresh accessToken using refreshToken (protected route)
app.post('/refreshToken', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.send(401).send('No token provided');
  if (!refreshTokens.includes(refreshToken))
    res.send(403).send('Invalid token');

  jwt.verify(refreshToken, secretKey, (err, data) => {
    if (err) res.send(403).send('Invalid token');

    generateTokens(data);

    res.status(200).send({accessToken});
  });
});

// Route to check when accessToken expires
app.get('/expires-in', (req, res) => {
  const timeLeft = jwt.decode(accessToken).exp - Date.now() / 1000;
  const timeExpires = new Date(Date.now() + timeLeft * 1000);

  res.status(200).send({timeExpires});
});

// Route to handle user logout and clear tokens
app.post('/logout', (req, res) => {
  const refreshToken = req.body.token;

  // Check if refreshToken exists in refreshTokens array
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).send('Invalid token');
  }

  // Remove refreshToken from refreshTokens array
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);

  res.status(200).send('Logout successful');
});

// Route to handle user registration and generate new tokens
app.post('/register', (req, res) => {
  const {username, password, role} = req.body;
  const existingUser = users.find(u => u.username === username);

  if (existingUser) {
    return res.status(409).send('Username is already in use');
  }

  const newUser = {id: users.length + 1, username, password, role};
  users.push(newUser);

  generateTokens(newUser);

  res.status(200).send({accessToken, refreshToken});
});

app.listen(PORT, () => {
  console.log(`Auth Server running on port ${PORT}`);
});
