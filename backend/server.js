const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'onghai-secret-key-2026';

app.use(cors());
app.use(express.json());

// Connect to existing SQLite database
const dbPath = path.resolve(__dirname, process.env.DB_PATH || './database/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

// --- DATABASE HELPERS ---
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getOne = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  };

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        resolve({ id: this.lastID, changes: this.changes });
      });
    });
  };

// --- AUTO-MIGRATION & SEEDING ---
async function initDb() {
    console.log('Initializing database schema...');
    try {
        await run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'guest',
            created_at DATETIME,
            updated_at DATETIME
        )`);

        await run(`CREATE TABLE IF NOT EXISTS properties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            price_per_night DECIMAL(12,2),
            address TEXT,
            category TEXT,
            status TEXT DEFAULT 'active',
            host_name TEXT,
            created_at DATETIME,
            updated_at DATETIME
        )`);

        await run(`CREATE TABLE IF NOT EXISTS property_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            property_id INTEGER,
            image_url TEXT,
            FOREIGN KEY (property_id) REFERENCES properties (id)
        )`);

        await run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            property_id INTEGER,
            check_in_date DATE,
            check_out_date DATE,
            status TEXT DEFAULT 'confirmed',
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (property_id) REFERENCES properties (id)
        )`);

        console.log('Schema initialized.');
        await seedData();
    } catch (err) {
        console.error('Migration failed:', err.message);
    }
}

async function seedData() {
    const propertyCount = await getOne('SELECT COUNT(*) as count FROM properties');
    if (propertyCount.count === 0) {
        console.log('Seeding initial data...');
        const samples = [
            {
                title: 'Landmark 81 View Luxury Apartment',
                description: 'Căn hộ cao cấp với tầm nhìn triệu đô hướng thẳng ra tháp Landmark 81. Đầy đủ tiện nghi hiện đại, hồ bơi vô cực và gym.',
                price: 2500000,
                address: 'Bình Thạnh, TP. Hồ Chí Minh',
                category: 'Căn hộ',
                host: 'Nguyễn Minh Hải',
                images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200']
            },
            {
                title: 'Beachfront Modern Villa Da Nang',
                description: 'Villa sát biển Mỹ Khê với thiết kế mở, đón nắng gió tự nhiên. Thích hợp cho kỳ nghỉ dưỡng gia đình.',
                price: 5000000,
                address: 'Ngũ Hành Sơn, Đà Nẵng',
                category: 'Biển',
                host: 'Lê Anh Tuấn',
                images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1200']
            },
            {
                title: 'Romantic Pine Hill Cabin',
                description: 'Ngôi nhà gỗ nhỏ xinh nằm giữa đồi thông mộng mơ của Đà Lạt. Không gian yên bình, se lạnh cực chill.',
                price: 1200000,
                address: 'Phường 10, Đà Lạt',
                category: 'Đồi núi',
                host: 'Trần Thu Hà',
                images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200']
            },
            {
                title: 'Old Quarter Boutique House',
                description: 'Ngôi nhà cổ được trùng tu mang phong cách Indochine giữa lòng phố cổ Hà Nội. Gần hồ Hoàn Kiếm và các điểm ẩm thực.',
                price: 1800000,
                address: 'Hoàn Kiếm, Hà Nội',
                category: 'Căn hộ',
                host: 'Phạm Quang Vinh',
                images: ['https://images.unsplash.com/photo-1555854816-802f18809674?auto=format&fit=crop&q=80&w=1200']
            }
        ];

        for (const s of samples) {
            const res = await run(
                'INSERT INTO properties (title, description, price_per_night, address, category, host_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [s.title, s.description, s.price, s.address, s.category, s.host, new Date().toISOString(), new Date().toISOString()]
            );
            for (const img of s.images) {
                await run('INSERT INTO property_images (property_id, image_url) VALUES (?, ?)', [res.id, img]);
            }
        }
        console.log('Seeding completed.');
    }
}

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// Auth
app.post('/api/v1/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await getOne('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await run(
            'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'guest', new Date().toISOString(), new Date().toISOString()]
        );

        const user = { id: result.id, name, email, role: role || 'guest' };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ user, access_token: token });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/v1/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getOne('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác.' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác.' });

        const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
        const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
        res.json({ user: userData, access_token: token });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/v1/me', authenticateToken, async (req, res) => {
    try {
        const user = await getOne('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Properties
app.get('/api/v1/properties', async (req, res) => {
    try {
        const properties = await query('SELECT * FROM properties WHERE status = ?', ['active']);
        const images = await query('SELECT * FROM property_images');
        const results = properties.map(p => ({
            ...p,
            price_per_night: Number(p.price_per_night),
            images: images.filter(img => img.property_id === p.id)
        }));
        res.json(results);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/v1/properties/:id', async (req, res) => {
    try {
        const property = await getOne('SELECT * FROM properties WHERE id = ?', [req.params.id]);
        if (!property) return res.status(404).json({ error: 'Property not found' });
        const images = await query('SELECT * FROM property_images WHERE property_id = ?', [req.params.id]);
        res.json({ ...property, price_per_night: Number(property.price_per_night), images });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/v1/properties/:id/availability', async (req, res) => {
    try {
        const bookings = await query('SELECT check_in_date, check_out_date FROM bookings WHERE property_id = ? AND status != ?', [req.params.id, 'cancelled']);
        const availability = [];
        const now = new Date();
        for (let i = 0; i < 30; i++) {
            const currentDate = new Date(now);
            currentDate.setDate(now.getDate() + i);
            const dateStr = currentDate.toISOString().split('T')[0];
            const isBooked = bookings.some(b => dateStr >= b.check_in_date && dateStr < b.check_out_date);
            availability.push({ date: dateStr, is_available: !isBooked });
        }
        res.json(availability);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/up', (req, res) => res.send('OK'));

app.listen(port, () => {
    console.log(`Node.js server running at http://localhost:${port}`);
});
