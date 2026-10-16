import { config as loadEnv } from "dotenv";
import { getAppPool } from "../db/pool.js";

loadEnv({ path: ".env.local" });
loadEnv();

async function main() {
  const pool = getAppPool();
  const server = await pool.query("SHOW server_encoding");
  const client = await pool.query("SHOW client_encoding");
  const db = await pool.query(
    "SELECT current_database() AS db, pg_encoding_to_char(encoding) AS enc FROM pg_database WHERE datname = current_database()",
  );
  console.log({
    server: server.rows[0],
    client: client.rows[0],
    database: db.rows[0],
  });

  try {
    await pool.query(
      "INSERT INTO content_translation (id, entity_type, entity_id, locale, doc, publication_status) VALUES ($1,$2,$3,$4,$5::jsonb,$6) ON CONFLICT DO NOTHING",
      [
        "encoding-probe",
        "site_document",
        "__probe__",
        "ar",
        JSON.stringify({ headline: "اختبار" }),
        "draft",
      ],
    );
    console.log("arabic insert: OK");
    await pool.query("DELETE FROM content_translation WHERE id = $1", [
      "encoding-probe",
    ]);
  } catch (error) {
    console.error("arabic insert: FAIL", error);
  }

  await pool.end();
}

main();
