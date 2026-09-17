import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const feedback = mysqlTable("feedback", {
  id: int("id").autoincrement().primaryKey(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  customerName: varchar("customerName", { length: 120 }),
  customerContact: varchar("customerContact", { length: 160 }),
  rating: int("rating").notNull(),
  npsScore: int("npsScore").notNull(),
  serviceType: varchar("serviceType", { length: 80 }).notNull(),
  comment: text("comment"),
  sentiment: mysqlEnum("sentiment", ["positive", "neutral", "negative"]).notNull(),
  tags: text("tags"),
  source: mysqlEnum("source", ["google-qr", "direct", "landing", "counter"]).default("direct").notNull(),
  followUp: int("followUp").default(0).notNull(),
  status: mysqlEnum("status", ["new", "reviewed", "closed"]).default("new").notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;
