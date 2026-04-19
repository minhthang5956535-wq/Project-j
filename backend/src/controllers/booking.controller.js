const { query, run } = require('../config/db');

exports.getMyBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const bookings = await query(`
            SELECT b.*, p.title as property_title, p.address as property_address,
            (SELECT image_url FROM property_images WHERE property_id = p.id LIMIT 1) as property_image
            FROM bookings b
            JOIN properties p ON b.property_id = p.id
            WHERE b.user_id = ?
            ORDER BY b.check_in_date DESC
        `, [userId]);
        
        res.json(bookings);
    } catch (err) {
        next(err);
    }
};

exports.createBooking = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { property_id, check_in_date, check_out_date, number_of_guests, total_price, payment_received, payment_status } = req.body;
        
        if (!property_id || !check_in_date || !check_out_date || !total_price) {
            return res.status(400).json({ message: 'Thiếu thông tin đặt phòng.' });
        }

        const result = await run(
            'INSERT INTO bookings (user_id, property_id, check_in_date, check_out_date, number_of_guests, total_price, payment_received, payment_status, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, property_id, check_in_date, check_out_date, number_of_guests || 1, total_price, payment_received || 0, payment_status || 'pending', 'confirmed', new Date().toISOString(), new Date().toISOString()]
        );
        
        res.status(201).json({ message: 'Đặt phòng thành công.', id: result.id });
    } catch (err) {
        next(err);
    }
};

exports.cancelBooking = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        // Ensure the booking belongs to the user and is still pending
        const booking = await getOne('SELECT status FROM bookings WHERE id = ? AND user_id = ?', [id, userId]);
        
        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng.' });
        }
        
        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Chỉ có thể hủy đơn đặt phòng đang ở trạng thái chờ xác nhận.' });
        }
        
        await run('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?', ['cancelled', new Date().toISOString(), id]);
        
        res.json({ message: 'Đã hủy đơn đặt phòng thành công.' });
    } catch (err) {
        next(err);
    }
};
