const { query, getOne, run } = require('../config/db');

exports.getAllProperties = async (req, res, next) => {
    try {
        const { category, search } = req.query;
        let sql = 'SELECT * FROM properties WHERE status = ?';
        let params = ['active'];

        if (category && category !== 'Tất cả') {
            sql += ' AND category = ?';
            params.push(category);
        }

        if (search) {
            sql += ' AND (title LIKE ? OR address LIKE ? OR category LIKE ? OR description LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam, searchParam);
        }

        const properties = await query(sql, params);
        const images = await query('SELECT * FROM property_images');

        const results = properties.map(p => ({
            ...p,
            price_per_night: Number(p.price_per_night),
            images: images.filter(img => img.property_id === p.id)
        }));

        res.json(results);
    } catch (err) {
        next(err);
    }
};

exports.getPropertyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const property = await getOne('SELECT * FROM properties WHERE id = ?', [id]);
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const images = await query('SELECT * FROM property_images WHERE property_id = ?', [id]);
        
        res.json({
            ...property,
            price_per_night: Number(property.price_per_night),
            images
        });
    } catch (err) {
        next(err);
    }
};

exports.getPropertyAvailability = async (req, res, next) => {
    try {
        const { id } = req.params;
        const bookings = await query(
            'SELECT check_in_date, check_out_date FROM bookings WHERE property_id = ? AND status != ?',
            [id, 'cancelled']
        );

        const availability = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today in local time
        
        for (let i = 0; i < 90; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            
            // Format as YYYY-MM-DD locally
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const isBooked = bookings.some(b => {
                return dateStr >= b.check_in_date && dateStr < b.check_out_date;
            });

            availability.push({
                date: dateStr,
                is_available: !isBooked
            });
        }

        res.json(availability);
    } catch (err) {
        next(err);
    }
};
