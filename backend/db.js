import postgres from "postgres";

const connectionstring = process.env.SUPABASE_URL;

if (!connectionstring) {
  throw new Error(
    "SUPABASE URL enviroment variable is either not set or found",
    "Double check you ENV config",
  );
}

const sql = postgres(connectionstring);

export default sql;
