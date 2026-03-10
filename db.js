const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '10.8.0.184',
  port: 3306,
  user: 'root',
  password: '12345',
  database: 'mirth_meta_data',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
