import { 
  users, 
  categories, 
  contents,
  userLinks,
  type User, 
  type InsertUser, 
  type Category, 
  type InsertCategory, 
  type Content, 
  type InsertContent, 
  type ContentWithCategory,
  type UserLink,
  type InsertUserLink,
  type UserWithLinks
} from "@shared/schema";
import { Store } from "express-session";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import session from "express-session";

// Interface for both in-memory and database storage
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // User links methods (for link-in-bio functionality)
  getUserLinks(userId: number): Promise<UserLink[]>;
  getUserWithLinks(username: string): Promise<UserWithLinks | undefined>;
  createUserLink(link: InsertUserLink): Promise<UserLink>;
  updateUserLink(id: number, link: Partial<InsertUserLink>): Promise<UserLink | undefined>;
  deleteUserLink(id: number): Promise<boolean>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Content methods
  getAllContents(): Promise<ContentWithCategory[]>;
  getContent(id: number): Promise<ContentWithCategory | undefined>;
  getContentsByCategory(categorySlug: string): Promise<ContentWithCategory[]>;
  getFeaturedContents(): Promise<ContentWithCategory[]>;
  getLatestContents(): Promise<ContentWithCategory[]>;
  createContent(content: InsertContent): Promise<Content>;
  
  // Session store for authentication
  sessionStore: Store;
}

// Database implementation
const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // User links methods
  async getUserLinks(userId: number): Promise<UserLink[]> {
    return db.select()
      .from(userLinks)
      .where(eq(userLinks.userId, userId))
      .orderBy(userLinks.order);
  }

  async getUserWithLinks(username: string): Promise<UserWithLinks | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) return undefined;
    
    const links = await this.getUserLinks(user.id);
    return {
      ...user,
      links
    };
  }

  async createUserLink(link: InsertUserLink): Promise<UserLink> {
    const [newLink] = await db.insert(userLinks).values(link).returning();
    return newLink;
  }

  async updateUserLink(id: number, link: Partial<InsertUserLink>): Promise<UserLink | undefined> {
    const [updatedLink] = await db
      .update(userLinks)
      .set(link)
      .where(eq(userLinks.id, id))
      .returning();
    return updatedLink;
  }

  async deleteUserLink(id: number): Promise<boolean> {
    const [deletedLink] = await db
      .delete(userLinks)
      .where(eq(userLinks.id, id))
      .returning();
    return !!deletedLink;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Content methods
  async getAllContents(): Promise<ContentWithCategory[]> {
    const result = await db.select({
      content: contents,
      category: categories
    })
    .from(contents)
    .innerJoin(categories, eq(contents.categoryId, categories.id));
    
    return result.map(({ content, category }) => ({
      ...content,
      category
    }));
  }

  async getContent(id: number): Promise<ContentWithCategory | undefined> {
    const [result] = await db.select({
      content: contents,
      category: categories
    })
    .from(contents)
    .innerJoin(categories, eq(contents.categoryId, categories.id))
    .where(eq(contents.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.content,
      category: result.category
    };
  }

  async getContentsByCategory(categorySlug: string): Promise<ContentWithCategory[]> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, categorySlug));
    if (!category) return [];
    
    const result = await db.select({
      content: contents,
      category: categories
    })
    .from(contents)
    .innerJoin(categories, eq(contents.categoryId, categories.id))
    .where(eq(contents.categoryId, category.id));
    
    return result.map(({ content, category }) => ({
      ...content,
      category
    }));
  }

  async getFeaturedContents(): Promise<ContentWithCategory[]> {
    const result = await db.select({
      content: contents,
      category: categories
    })
    .from(contents)
    .innerJoin(categories, eq(contents.categoryId, categories.id))
    .where(eq(contents.featured, true));
    
    return result.map(({ content, category }) => ({
      ...content,
      category
    }));
  }

  async getLatestContents(): Promise<ContentWithCategory[]> {
    const result = await db.select({
      content: contents,
      category: categories
    })
    .from(contents)
    .innerJoin(categories, eq(contents.categoryId, categories.id))
    .orderBy(desc(contents.createdAt))
    .limit(8);
    
    return result.map(({ content, category }) => ({
      ...content,
      category
    }));
  }

  async createContent(content: InsertContent): Promise<Content> {
    const [newContent] = await db.insert(contents).values(content).returning();
    return newContent;
  }
}

// Use DatabaseStorage 
export const storage = new DatabaseStorage();