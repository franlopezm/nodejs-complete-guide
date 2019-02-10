const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'nodeComplete',
  database: 'node-complete',
  password: 'nodeComplete'
});

module.exports = pool.promise();