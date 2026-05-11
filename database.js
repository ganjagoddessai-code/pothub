// /config/database.js

const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");
const { Pool } = require("pg");
require("dotenv").config();

/**
 * 🌌 GANJAGODDESSAI — DATABASE ORCHESTRATION LAYER
 * Multi-database hybrid system:
 * - PostgreSQL (relational commerce + users)
 * - MongoDB (flexible AI/session memory)
 * - Optional Redis hook (future queue/cache layer)
 */

/* =========================
   POSTGRESQL (PRIMARY DB)
========================= */

const postgres = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT || 5432,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 20,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
    },
  }
);

/* Raw PG pool (for high-performance queries if needed) */
const pgPool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  max: 30,
  idleTimeoutMillis: 30000,
});

/* =========================
   MONGODB (AI MEMORY LAYER)
========================= */

const connectMongo = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI not defined in environment");
    }

    await mongoose.connect(uri, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("🧠 MongoDB Memory Layer Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
};

/* =========================
   DATABASE INITIALIZATION
========================= */

const initDatabases = async () => {
  try {
    await postgres.authenticate();
    console.log("🟢 PostgreSQL Connected");

    await connectMongo();
  } catch (err) {
    console.error("❌ Database Init Failed:", err.message);
    process.exit(1);
  }
};

/* =========================
   HEALTH CHECK
========================= */

const healthCheck = async () => {
  const status = {
    postgres: false,
    mongo: mongoose.connection.readyState === 1,
  };

  try {
    await postgres.authenticate();
    status.postgres = true;
  } catch (err) {
    status.postgres = false;
  }

  return status;
};

/* =========================
   EXPORTS
========================= */

module.exports = {
  postgres,
  pgPool,
  mongoose,
  initDatabases,
  healthCheck,
};
