const express = require('express');
const mysql = require('mysql');
const { execFile } = require('child_process');
const crypto = require('crypto');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: process.env.MYSQL_URL,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE 
});

connection.connect();

// Disable x-powered-by header
app.disable('x-powered-by');

// SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = ${mysql.escape(userId)}`; // Escaping user input to prevent SQL Injection
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    execFile(cmd, (err, stdout, stderr) => { // Executing command in a new process instead of using a shell
        if (err) {
            res.send(`Error: ${stderr}`);
            return;
        }
        res.send(`Output: ${stdout}`);
    });
});

// Secure Random Number Generation
app.get('/random', (req, res) => {
    const array = new Uint32Array(1);
    crypto.randomFillSync(array);
    const randomNumber = array[0] / 4294967295; // Normalizing the random number between 0 and 1
    res.send(`Random number: ${randomNumber}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});