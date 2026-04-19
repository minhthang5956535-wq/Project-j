const { run, getOne, query } = require('./db');
const bcrypt = require('bcryptjs');

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
            number_of_guests INTEGER,
            total_price DECIMAL(12,2),
            payment_received DECIMAL(12,2),
            payment_status TEXT,
            status TEXT DEFAULT 'confirmed'
        )`);

        // Migration: Add columns if they don't exist
        try { await run('ALTER TABLE bookings ADD COLUMN number_of_guests INTEGER'); } catch(e) {}
        try { await run('ALTER TABLE bookings ADD COLUMN total_price DECIMAL(12,2)'); } catch(e) {}
        try { await run('ALTER TABLE bookings ADD COLUMN payment_received DECIMAL(12,2)'); } catch(e) {}
        try { await run('ALTER TABLE bookings ADD COLUMN payment_status TEXT'); } catch(e) {}
        try { await run('ALTER TABLE bookings ADD COLUMN created_at DATETIME'); } catch(e) {}
        try { await run('ALTER TABLE bookings ADD COLUMN updated_at DATETIME'); } catch(e) {}

        console.log('Schema initialized & Migrated.');
        await seedData();
    } catch (err) {
        console.error('Migration failed:', err.message);
    }
}

async function seedData() {
    // Seed Admin
    const adminUser = await getOne('SELECT id FROM users WHERE email = ?', ['admin@onghai.com']);
    if (!adminUser) {
        console.log('Seeding initial Admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await run(
            'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            ['Admin Hải', 'admin@onghai.com', hashedPassword, 'admin', new Date().toISOString(), new Date().toISOString()]
        );
    } else {
        await run("UPDATE users SET role = 'admin' WHERE email = ?", ['admin@onghai.com']);
        console.log('Admin role verified.');
    }

    // Seed More Users
    const userCount = await getOne('SELECT COUNT(*) as count FROM users');
    if (userCount.count < 5) {
        console.log('Seeding more sample users...');
        const moreUsers = [
            { name: 'Nguyễn Văn A', email: 'vana@gmail.com' },
            { name: 'Trần Thị B', email: 'thib@gmail.com' },
            { name: 'Lê Văn C', email: 'vanc@gmail.com' },
            { name: 'Hoàng Minh D', email: 'minhd@gmail.com' }
        ];
        for (const u of moreUsers) {
            const hash = await bcrypt.hash('user123', 10);
            await run('INSERT OR IGNORE INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', 
            [u.name, u.email, hash, 'guest', new Date().toISOString(), new Date().toISOString()]);
        }
    }

    const propertyCount = await getOne('SELECT COUNT(*) as count FROM properties');
    if (propertyCount.count < 8) {
        console.log('Pumping more premium properties...');
        const samples = [
            {
                title: 'Sky Garden Penthouse District 1',
                description: 'Căn hộ Penthouse đẳng cấp với sân vườn riêng biệt trên mái tháp cao nhất Quận 1.',
                price: 8500000,
                address: 'Lê Thánh Tôn, Quận 1, TP. HCM',
                category: 'Căn hộ',
                host: 'Nguyễn Minh Hải',
                images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200']
            },
            {
                title: 'Hoi An Ancient Heritage Villa',
                description: 'Trải nghiệm không gian sống cổ kính trong lòng phố cổ Hội An với đầy đủ tiện nghi 5 sao.',
                price: 3500000,
                address: 'Trần Phú, Hội An',
                category: 'Căn hộ',
                host: 'Lê Anh Tuấn',
                images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200']
            },
            {
                title: 'Infinity Oceanfront Villa Phu Quoc',
                description: 'Villa với hồ bơi vô cực rộng lớn hướng thẳng ra hoàng hôn Đảo Ngọc.',
                price: 12000000,
                address: 'Bãi Trường, Phú Quốc',
                category: 'Hồ bơi',
                host: 'Minh Tú',
                images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200']
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
    }

    // Seed More Bookings
    const bookingCount = await getOne('SELECT COUNT(*) as count FROM bookings');
    if (bookingCount.count < 10) {
        console.log('Generating sample bookings for analytics...');
        const users = await query('SELECT id FROM users WHERE role = ?', ['guest']);
        const props = await query('SELECT id FROM properties');
        
        if (users.length > 0 && props.length > 0) {
            for (let i = 0; i < 15; i++) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                const randomProp = props[Math.floor(Math.random() * props.length)];
                
                await run(
                    'INSERT INTO bookings (user_id, property_id, check_in_date, check_out_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [randomUser.id, randomProp.id, '2026-04-10', '2026-04-15', 'confirmed', new Date().toISOString(), new Date().toISOString()]
                );
            }
        }
    }
    console.log('Database schema & seeding completed.');
}

module.exports = { initDb };
