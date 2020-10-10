module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.USER_DB || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'twitter',
        charset : 'utf8mb4'
    }
}