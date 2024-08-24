const express = require('express');
const mysql = require('mysql');
const { escape } = require('sqlstring');
const { exec } = require('child_process');
const RateLimit = require('express-rate-limit');

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

// Fixed SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = escape(req.query.id); // Escaping user input
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    // Preventing command injection by restricting input to alphabetic characters
    if (/^[a-zA-Z]+$/.test(cmd)) {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                res.send(`Error: ${stderr}`);
                return;
            }
            res.send(`Output: ${stdout}`);
        });
    } else {
        res.send('Invalid command');
    }
});

// Insecure Random Number Generation
app.get('/random', (req, res) => {
    const randomNumber = Math.random(); // Insecure random number generation
    res.send(`Random number: ${randomNumber}`);
});

// Rate Limiting Middleware
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});
app.use(limiter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});