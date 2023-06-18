const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const app = express();
app.use(express.json());

dotenv.config();

// Secret key used for JWT token generation
const secretKey = process.env.ACCESS_TOKEN_SECRET;

const bookList = [
  {
    id: 1,
    title: 'Harry Potter and the Chamber of Secrets',
  },
  {
    id: 2,
    title: 'Jurassic Park',
  },
  {
    id: 3,
    title: 'The Lord of the Rings',
  },
];

// Middleware to verify JWT tokens in protected routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({message: 'No token provided'});
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({message: 'Token expired'});
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).send({message: 'Invalid token'});
      } else if (err.name === 'NotBeforeError') {
        return res.status(401).send({message: 'Token not active'});
      } else {
        return res.status(401).send({message: 'Failed to authenticate token'});
      }
    }

    req.user = user;
    next();
  });
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to get list of users with roles (protected route)
app.get('/books', authenticateToken, (req, res) => {
  res.status(200).send(bookList);
});

// Start the server
app.listen(8080, () => {
  console.log('Mock backend server started on port 8080');
});
