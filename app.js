const express = require("express");
const fs = require("fs");
const child_process = require("child_process");

const app = express();

const API_KEY = "sk_test_123456789"; // Hardcoded secret

// Existing vulnerable endpoint
app.get("/user", (req, res) => {
    const id = req.query.id;

    // SQL Injection vulnerability
    const query = "SELECT * FROM users WHERE id = " + id;

    // XSS vulnerability
    res.send("<h1>User ID: " + id + "</h1>");
});

// Existing critical RCE
app.get("/exec", (req, res) => {
    eval(req.query.code); // Critical Remote Code Execution
});

// NEW: Sensitive secret exposure
app.get("/debug", (req, res) => {
    res.send("API Key: " + API_KEY);
});

// NEW: Command Injection vulnerability
app.get("/run", (req, res) => {
    const cmd = req.query.cmd;

    child_process.exec(cmd, (err, stdout, stderr) => {
        if (err) {
            res.send(err.message);
            return;
        }
        res.send(stdout);
    });
});

// NEW: Path Traversal vulnerability
app.get("/read", (req, res) => {
    const file = req.query.file;

    try {
        const content = fs.readFileSync(file, "utf8");
        res.send(content);
    } catch (err) {
        res.send(err.message);
    }
});

// NEW: Weak cryptography
app.get("/hash", (req, res) => {
    const crypto = require("crypto");
    const hash = crypto.createHash("md5").update(req.query.input).digest("hex");
    res.send(hash);
});

// NEW: Insecure randomness
app.get("/token", (req, res) => {
    const token = Math.random().toString(36).substring(2);
    res.send("Generated token: " + token);
});
// NEW: Server-Side Request Forgery (SSRF)
const axios = require("axios");

app.get("/fetch", async (req, res) => {
    const url = req.query.url;

    try {
        const response = await axios.get(url); // Unsafe external request
        res.send(response.data);
    } catch (err) {
        res.send(err.message);
    }
});
app.listen(3000, () => {
    console.log("Vulnerable demo app running on port 3000");
});
