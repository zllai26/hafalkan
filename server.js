const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const db = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'admin',
    password: 'your_own_password', 
    database: 'word_saver'
});

app.post('/register', async (req, res) => {
    const { userid, passwd } = req.body;

    if (!userid || !passwd) {
        return res.status(400).json({ message: 'User ID and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(passwd, 10);

        const sql = 'INSERT INTO users (userid, password_hash) VALUES (?, ?)';
        db.query(sql, [userid, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'User ID already exists.' });
                }
                console.error(err);
                return res.status(500).json({ message: 'Database error.' });
            }
            res.status(201).json({ message: 'Account registered successfully!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

app.post('/main', (req, res) => {
    const { userid, vocab, trans } = req.body;

    if (!userid || !vocab || !trans) {
        return res.status(400).json({ message: 'User ID, Vocabulary, and Translation are required.' });
    }

    const sql = 'INSERT INTO content (userid, vocab, trans) VALUES (?, ?, ?)';
    db.query(sql, [userid, vocab, trans], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error.' });
        }
        res.status(201).json({ message: 'Word saved successfully!' });
    });
});

app.get('/main/:userid', (req, res) => {
    const { userid } = req.params;

    const sql = 'SELECT id, vocab, trans, created_at FROM content WHERE userid = ? ORDER BY id DESC';
    db.query(sql, [userid], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error.' });
        }
        res.status(200).json(results);
    });
});


app.listen(3000, () => {
    console.log('Backend server running at http://localhost:3000');
});

app.post('/login', (req, res) => {
    const { userid, passwd } = req.body;

    if (!userid || !passwd) {
        return res.status(400).json({ message: 'User ID and password are required.' });
    }

    const sql = 'SELECT * FROM users WHERE userid = ?';
    db.query(sql, [userid], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid User ID or password.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(passwd, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid User ID or password.' });
        }

        res.status(200).json({ message: 'Login successful!', userid: user.userid });
    });
});

app.get('/quiz/:userid', (req, res) => {
    const { userid } = req.params;

    const sql = 'SELECT id, vocab, trans FROM content WHERE userid = ? ORDER BY RAND()';
    db.query(sql, [userid], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error.' });
        }
        res.status(200).json(results);
    });
});

app.get('/vocab/:userid', (req, res) => {
    const { userid } = req.params;

    const sql = 'SELECT id, vocab, trans, created_at FROM content WHERE userid = ? ORDER BY id DESC';
    db.query(sql, [userid], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error.' });
        }
        res.status(200).json(results);
    });
});

