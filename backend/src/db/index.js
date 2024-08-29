import { MYSQL_DB_NAME } from "../../constants.js"
import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: MYSQL_DB_NAME,
    port: process.env.MYSQL_DB_PORT || 3306 
});

pool.getConnection()
    .then(connection => {
        console.log(`MySQL Connected: ${connection.config.host}`);
        connection.release();
    })
    .catch(error => {
        console.error('MySQL Connection Error:', error);
        process.exit(1);
    });

export default pool; 
