import { boolean, date, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(uuidv4),
  name: varchar("name", { length: 40 }).notNull(),
  email: varchar("email", { length: 345 }).notNull(),
  image: text("image").notNull(),
  password: varchar("password", { length: 50 }).notNull(),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at").defaultNow().notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
});

export const chats = pgTable("chats", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(uuidv4),
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 40 }).notNull(),
  createdAt: date("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(uuidv4),
  chatId: varchar("chat_id", { length: 36 })
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: date("created_at").defaultNow().notNull(),
});
