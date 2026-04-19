const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getOne, run } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'onghai-secret-key-2026';

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        
        const existingUser = await getOne('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await run(
            'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'guest', new Date().toISOString(), new Date().toISOString()]
        );

        const user = { id: result.id, name, email, role: role || 'guest' };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ user, access_token: token });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await getOne('SELECT * FROM users WHERE email = ?', [email]);
        
        if (!user) {
            return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác.' });
        }

        const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
        const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });

        res.json({ user: userData, access_token: token });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await getOne('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};
