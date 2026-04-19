const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend/database/database.sqlite');
const db = new sqlite3.Database(dbPath);

const email = 'admin@onghai.com';

db.run("UPDATE users SET role = 'admin' WHERE email = ?", [email], function(err) {
    if (err) {
        console.error('Lỗi nâng cấp:', err.message);
        process.exit(1);
    }
    console.log(`Đã nâng cấp ${this.changes} tài khoản thành Admin tối cao!`);
    db.close();
});
