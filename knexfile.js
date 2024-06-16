import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    client: "sqlite3",
    connection: {
      filename: process.env.DATABASE_NAME || "knex-demo.sqlite3",
    },
    useNullAsDefault: true,
    migrations: {
      tableName: "knex_migrations", // table that will store the migration history
      directory: "./src/migrations", // location of the migration files
      stub: "./migration.stub", // this is the file that will be copied when creating a new migration
    },
    seeds: {
      directory: "./src/seeds", // location of the seed files (seeds = initial data for the database)
      stub: "./seed.stub", // this is the file that will be copied when creating a new seed
    },
  },
};

export default config;
