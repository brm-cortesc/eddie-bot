//  config.js
//
//  Simple application configuration. Extend as needed.
module.exports = {
	port: process.env.PORT || 3000,
  db: {
    // host: 'localhost',
    host: process.env.DATABASE_HOST || '127.0.0.1',
    database: 'eddie',
    user: 'eddie_service',
    password: '123',
    port: 3306
  }
};