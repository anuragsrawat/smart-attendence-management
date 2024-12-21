const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); 

mongoose.connect('mongodb://localhost:27017/yourDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User Registered');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email }, 'yourSecretKey', { expiresIn: '1h' });

            let role;
            if (email.endsWith('.ddn.upes.ac.in')) {
                role = 'teacher';
            } else if (email.endsWith('.stu.upes.ac.in')) {
                role = 'student';
            } else {
                role = 'unknown'; 
            }

            res.status(200).json({ message: 'Login Successful', token, role });
        } else {
            res.status(400).send('Invalid Credentials');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token missing');

    jwt.verify(token, 'yourSecretKey', (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
};

app.get('/dashboard', authenticateToken, (req, res) => {
    res.status(200).send(`Welcome, ${req.user.email}`);
});

app.get('/teacher.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher.html'));
});

app.get('/student.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'student.html'));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
