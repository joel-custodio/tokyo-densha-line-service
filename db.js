const { Pool } = require('pg');
require('dotenv').config({ path: '.env.development.local' });

const pool = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT, // default Postgres port
	database: process.env.DB_NAME,
});

module.exports = pool;
