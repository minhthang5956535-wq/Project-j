const { run, query } = require('./db');
const bcrypt = require('bcryptjs');

async function reseed() {
    console.log('--- FORCED RESEED STARTED ---');
    try {
        // 1. Wipe everything
        console.log('Cleaning existing data...');
        await run('DELETE FROM property_images');
        await run('DELETE FROM bookings');
        await run('DELETE FROM properties');
        await run('DELETE FROM users');
        
        // Reset sequences
        try {
            await run('DELETE FROM sqlite_sequence WHERE name IN ("users", "properties", "property_images", "bookings")');
        } catch(e) {}

        // 2. Seed Admin
        console.log('Seeding Super Admin...');
        const adminHash = await bcrypt.hash('admin123', 10);
        await run(
            'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            ['Huỳnh Minh Thắng', 'admin@onghai.com', adminHash, 'admin', new Date().toISOString(), new Date().toISOString()]
        );

        // 3. Seed Sample Users
        console.log('Seeding Sample Users...');
        const userHash = await bcrypt.hash('user123', 10);
        const users = [
            ['Nguyễn Văn An', 'vana@gmail.com'],
            ['Trần Thị Bình', 'thib@gmail.com'],
            ['Lê Anh Tuấn', 'anhtuan@gmail.com'],
            ['Hoàng Minh Quân', 'minhquan@gmail.com']
        ];
        for (const u of users) {
            await run(
                'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
                [u[0], u[1], userHash, 'guest', new Date().toISOString(), new Date().toISOString()]
            );
        }

        // 4. Seed Premium Properties
        console.log('Pumping Premium Properties...');
        const premiumProperties = [
            {
                title: 'Sky Garden Penthouse District 1',
                description: 'Trải nghiệm cuộc sống thượng lưu tại căn hộ Penthouse đắt giá nhất Quận 1. Với hồ bơi riêng và view 360 độ toàn cảnh Sài Gòn, đây là nơi nghỉ dưỡng hoàn hảo cho những dịp đặc biệt.',
                price: 12500000,
                address: 'Lê Thánh Tôn, Quận 1, TP. HCM',
                category: 'Căn hộ',
                host: 'Huỳnh Minh Thắng',
                images: [
                    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'
                ]
            },
            {
                title: 'Hoi An Heritage Riverside Villa',
                description: 'Nằm bên dòng sông Hoài thơ mộng, Villa mang phong cách kiến trúc cổ điển của Hội An nhưng vẫn đầy đủ tiện nghi hiện đại. Một không gian yên bình để thư giãn tâm hồn.',
                price: 4500000,
                address: 'Cẩm Nam, Hội An, Quảng Nam',
                category: 'Căn hộ',
                host: 'Lê Anh Tuấn',
                images: [
                    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'
                ]
            },
            {
                title: 'Ocean Infinity Pool Villa Phu Quoc',
                description: 'Tận hưởng hoàng hôn tuyệt mỹ nhất Việt Nam ngay tại hồ bơi vô cực rộng lớn của Villa. Thiết kế mở đón trọn gió biển và ánh sáng tự nhiên.',
                price: 15800000,
                address: 'Bãi Trường, Dương Tơ, Phú Quốc',
                category: 'Hồ bơi',
                host: 'Hoàng Minh Quân',
                images: [
                    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
                ]
            },
            {
                title: 'Da Lat Cloud Mansion',
                description: 'Được mệnh danh là tòa lâu đài giữa sương mù Đà Lạt. Không gian kiến trúc Pháp sang trọng, ấm cúng với lò sưởi và vườn hoa cẩm tú cầu rực rỡ.',
                price: 3200000,
                address: 'Hồ Tuyền Lâm, Đà Lạt',
                category: 'Đồi núi',
                host: 'Trần Thị Bình',
                images: [
                    'https://images.unsplash.com/photo-1449156733864-dd5471bb7427?auto=format&fit=crop&q=80&w=1200',
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
                ]
            },
            {
                title: 'Modern Minimalist Studio Landmark 81',
                description: 'Phòng Studio hiện đại tầng cao với tầm nhìn trực diện sông Sài Gòn. Đầy đủ tiện ích cao cấp ngay dưới chân tòa tháp cao nhất Việt Nam.',
                price: 1800000,
                address: 'Vinhomes Central Park, Bình Thạnh, TP. HCM',
                category: 'Căn hộ',
                host: 'Admin',
                images: [
                    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200'
                ]
            }
        ];

        for (const p of premiumProperties) {
            const res = await run(
                'INSERT INTO properties (title, description, price_per_night, address, category, host_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [p.title, p.description, p.price, p.address, p.category, p.host, new Date().toISOString(), new Date().toISOString()]
            );
            for (const img of p.images) {
                await run('INSERT INTO property_images (property_id, image_url) VALUES (?, ?)', [res.id, img]);
            }
        }

        // 5. Seed Analytics Bookings
        console.log('Generating Analytics Bookings...');
        const guests = await query('SELECT id FROM users WHERE role = ?', ['guest']);
        const props = await query('SELECT id FROM properties');
        
        if (guests.length > 0 && props.length > 0) {
            for (let i = 0; i < 20; i++) {
                const randomUser = guests[Math.floor(Math.random() * guests.length)];
                const randomProp = props[Math.floor(Math.random() * props.length)];
                const status = i < 15 ? 'confirmed' : (i < 18 ? 'pending' : 'cancelled');
                
                await run(
                    'INSERT INTO bookings (user_id, property_id, check_in_date, check_out_date, number_of_guests, total_price, payment_status, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [randomUser.id, randomProp.id, '2026-04-20', '2026-04-25', 2, 8500000, 'paid', status, new Date().toISOString(), new Date().toISOString()]
                );
            }
        }

        console.log('--- FORCED RESEED COMPLETED SUCCESSFULLY ---');
        process.exit(0);
    } catch (err) {
        console.error('--- RESEED FAILED ---');
        console.error(err);
        process.exit(1);
    }
}

reseed();
