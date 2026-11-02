// ========== Database Connection ========== //
import postgres from "postgres";

/**
 * DATABASE CONNECTION SETUP
 *
 * This file creates and exports a single database connection that can be
 * used throughout the application.
 *
 * Key concepts:
 * 1. CONNECTION STRING: A URL containing all database credentials
 *    Format: postgres://user:password@host:port/database
 *
 * 2. ENVIRONMENT VARIABLES: Store sensitive credentials securely
 *    - Never commit database passwords to git
 *    - Use .env file for local development
 *
 * 3. TAGGED TEMPLATES: The sql`` syntax prevents SQL injection
 *    - Automatically escapes user input
 *    - Safely substitutes variables into queries
 *
 * Usage in other files:
 *   import sql from "./db.js";
 *   const result = await sql`SELECT * FROM threads`;
 */

// Get database connection string from environment variable
const connectionString = process.env.DATABASE_URL;

// Validate that DATABASE_URL is provided
if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
      "Please add it to your .env file."
  );
}

// Create the database connection
// The postgres() function returns a sql`` tagged template function
const sql = postgres(connectionString);

// Export for use in other files
export default sql;
