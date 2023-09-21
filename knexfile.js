require('dotenv').config();
module.exports = {
    development: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: './db/migrations',
            tableName: 'migrations'
        },
        seeds: {
            directory: './db/seeds',
        }
    }
}