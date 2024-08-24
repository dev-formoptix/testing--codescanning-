Here's the updated code that addresses the SQL injection vulnerability and uses query parameters to safely embed user input into the query string:

```javascript
const express = require('express');
const mysql = require('mysql');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// MySQL connection setup (replace with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test' 
});

connection.connect();

// Fixed SQL Injection Vulnerable Endpoint
app.get('/user', (req, res) => {
    const userId = req.query.id;
    const query = 'SELECT * FROM users WHERE id = ?'; // Safe query
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Command Injection Vulnerable Endpoint (still vulnerable, not addressed in this update)
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd;
    exec(cmd, (err, stdout, stderr) => { // Vulnerable to command injection
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

In the updated code:
- The SQL injection vulnerability in the `/user` endpoint is fixed by using the `?` placeholder in the query and passing `userId` as a query parameter in the `connection.query` function.
- The command injection vulnerability in the `/exec` endpoint is not addressed in this update. You can refer to the provided recommendations if you want to fix this vulnerability.
- The insecure random number generation is still present in the `/random` endpoint, as it is not related to the SQL injection vulnerability.

Remember to replace the MySQL connection credentials (`host`, `user`, `password`, and `database`) with your own values.