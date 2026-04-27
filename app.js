const express = require("express");
const app = express();

const API_KEY = "sk_test_123456789"; // Hardcoded secret

app.get("/user", (req, res) => {
    const id = req.query.id;

    // SQL Injection vulnerability
    const query = "SELECT * FROM users WHERE id = " + id;

    // XSS vulnerability
    res.send("<h1>User ID: " + id + "</h1>");
});

app.get("/exec", (req, res) => {
    eval(req.query.code); // Critical RCE
});

app.listen(3000);