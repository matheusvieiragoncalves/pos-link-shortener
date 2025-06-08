import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';

async function resetDatabase() {
  for (const table of Object.values(schema)) {
    await db.delete(table);
  }
}

resetDatabase()
  .then(() => {
    console.log('✅ Database reset successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error resetting database:', err);
    process.exit(1);
  });
