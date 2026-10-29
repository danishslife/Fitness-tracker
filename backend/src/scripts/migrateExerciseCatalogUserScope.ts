import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "../data-source";

/**
 * One-time DDL: scope custom catalog rows per user (nullable user_id).
 * Seeded rows keep user_id NULL and stay visible to everyone.
 *
 * Run: npm run migrate:catalog-user-scope
 */
async function main() {
  await AppDataSource.initialize();

  await AppDataSource.query(`
    ALTER TABLE exercise_catalog
      ADD COLUMN IF NOT EXISTS user_id integer NULL;
  `);

  await AppDataSource.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_exercise_catalog_user'
      ) THEN
        ALTER TABLE exercise_catalog
          ADD CONSTRAINT fk_exercise_catalog_user
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `);

  await AppDataSource.query(`
    ALTER TABLE exercise_catalog
      DROP CONSTRAINT IF EXISTS exercise_catalog_name_key;
  `);

  await AppDataSource.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_exercise_catalog_global_name
      ON exercise_catalog (LOWER(name))
      WHERE user_id IS NULL;
  `);

  await AppDataSource.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_exercise_catalog_user_name
      ON exercise_catalog (user_id, LOWER(name))
      WHERE user_id IS NOT NULL;
  `);

  console.log("Exercise catalog user scope migration applied.");
  await AppDataSource.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
