const mysql=require('mysql2');

const pool = mysql.createPool({
    host: 'localhost', // e.g., 'localhost'
    user: 'root',
    password: '09912.45',
    database: 'housing'
});

module.exports=pool.promise();