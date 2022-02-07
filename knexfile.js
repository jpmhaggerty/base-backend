require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      host : '127.0.0.1',
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      charset: 'utf8',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
