const mysql = require('mysql2');

const pool = mysql.Pool({
  host: 'localhost',
  user: 'nodeComplete',
  database: 'node-complete',
  password: 'nodeComplete'
});

module.exports = pool.promise();