// Updated code to address the vulnerability:

const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'test'
});

connection.connect();

// Import the express-rate-limit package
const rateLimit = require('express-rate-limit');

// Create a rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // maximum of 100 requests per windowMs
});

// Apply rate limiter middleware to all requests
app.use(limiter);

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ?`; // Using query parameters
  connection.query(query, [userId], (err, results) => { // Passing user input as parameter
    if (err) throw err;
    res.send(results);
  });
});

// Command Execution Endpoint (with validation)
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd;

  // Validate the command input to ensure it's safe
  const isSafe = /^[a-zA-Z0-9\s\-_.\/]*$/.test(cmd);
  if (!isSafe) {
    res.send('Invalid command input');
    return;
  }

  exec(cmd, (err, stdout, stderr) => { // Executing validated command
    if (err) {
      res.send(`Error: ${stderr}`);
      return;
    }
    res.send(`Output: ${stdout}`);
  });
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
  const randomNumber = Math.random(); // Insecure random number generation
  res.send(`Random number: ${randomNumber}`);
});

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

app.use(limiter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});