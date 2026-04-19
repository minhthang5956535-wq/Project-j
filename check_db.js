const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve('backend/database/database.sqlite');
const db = new sqlite3.Database(dbPath);

db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Tables:', rows.map(r => r.name).join(', '));
  db.close();
});
