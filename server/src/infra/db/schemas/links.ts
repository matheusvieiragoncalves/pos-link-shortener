import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').default(0).notNull(),
  createdAt: timestamp('remote_url').defaultNow()
});
