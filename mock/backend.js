const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 8080;

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
const refreshTokens = [];

app.use(bodyParser.json());

// Mock users
const users = [
  {
    username: 'test',
    password: 'test',
    role: 'admin'
  },
  {
    username: 'admin',
    password: 'admin',
  },
  {
    username: 'user',
    password: 'user',
    role: 'user'
  }
];

// Login
app.post('/login', (req, res) => {
  // Read username and password from request body
  const { username, password } = req.body;

  // Filter user from the users array by username and password
  const user = users.find(u => { return u.username === username && u.password === password });

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret, { expiresIn: '20m' });
    const refreshToken = jwt.sign({ username: user.username,  role: user.role }, refreshTokenSecret);

    refreshTokens.push(refreshToken);

    res.json({
      accessToken,
      refreshToken
    });
  } else {
    res.send('Username or password incorrect');
  }
});

// Protect the api route with JWT
app.get('/api', authenticateJWT, (req, res) => {
  res.json(users);
});

// Get a new access token with a refresh token
app.post('/token', (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.sendStatus(401);

  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign({ username: user.username,  role: user.role }, accessTokenSecret, { expiresIn: '20m' });

    res.json({
      accessToken
    });
  });
});

// Logout
app.post('/logout', (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter(t => t !== refreshToken);

  res.send("Logout successful");
});

// Helper function to authenticate JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// Run the server
app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`)
});
