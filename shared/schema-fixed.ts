import { pgTable, text, serial, integer, boolean, varchar, sql } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  theme: text("theme").default("default"),
  createdAt: text("created_at").default(sql`NOW()`).notNull()
});

// User links table for the Linktree-like functionality
export const userLinks = pgTable("user_links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: text("created_at").default(sql`NOW()`).notNull()
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  links: many(userLinks)
}));

export const userLinksRelations = relations(userLinks, ({ one }) => ({
  user: one(users, {
    fields: [userLinks.userId],
    references: [users.id],
  })
}));

// Legacy tables (keeping for backward compatibility)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  readTime: integer("read_time"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  featured: boolean("featured").default(false),
  createdAt: text("created_at").default(sql`NOW()`).notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  displayName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  theme: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertUserLinkSchema = createInsertSchema(userLinks).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export const insertContentSchema = createInsertSchema(contents).omit({
  id: true,
  createdAt: true,
  views: true,
  likes: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUserLink = z.infer<typeof insertUserLinkSchema>;
export type UserLink = typeof userLinks.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contents.$inferSelect;

export type ContentWithCategory = Content & {
  category: Category;
};

export type UserWithLinks = User & {
  links: UserLink[];
};