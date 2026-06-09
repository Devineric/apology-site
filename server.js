const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5632;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function readData() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch {
        return { visits: [], submissions: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post('/api/visit', (req, res) => {
    const data = readData();
    data.visits.push({ timestamp: new Date().toISOString() });
    writeData(data);
    res.json({ ok: true });
});

app.post('/api/submit', (req, res) => {
    const { choice, message } = req.body;
    if (!choice) {
        return res.status(400).json({ error: '请选择一个选项' });
    }
    const data = readData();
    data.submissions.push({
        choice,
        message: message || '',
        timestamp: new Date().toISOString()
    });
    writeData(data);
    res.json({ ok: true });
});

app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running at http://localhost:' + PORT);
});
