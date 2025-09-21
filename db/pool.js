import { Pool } from 'pg';


const pool = new Pool({
  host: "localhost", 
  user: "achaparro",
  database: "file_uploader",
  password: "ustele",
  port: 5432 
});

export default pool;