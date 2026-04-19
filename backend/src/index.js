const app = require('./app');
const dotenv = require('dotenv');
const { initDb } = require('./config/init');

dotenv.config();

const PORT = process.env.PORT || 5000;

initDb();

const server = app.listen(PORT, () => {
    console.log(`
    =========================================
    🚀 ONGHAI WORLD-CLASS SYSTEM STARTED
    =========================================
    Mode: ${process.env.NODE_ENV || 'development'}
    Port: ${PORT}
    URL : http://localhost:${PORT}
    =========================================
    `);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
