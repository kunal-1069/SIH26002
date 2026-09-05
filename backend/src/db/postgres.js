const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'sih_user',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'sih_db',
  password: process.env.POSTGRES_PASSWORD || 'sih_password',
  port: process.env.POSTGRES_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
