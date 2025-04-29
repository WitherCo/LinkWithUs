var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  categories: () => categories,
  contents: () => contents,
  insertCategorySchema: () => insertCategorySchema,
  insertContentSchema: () => insertContentSchema,
  insertUserLinkSchema: () => insertUserLinkSchema,
  insertUserSchema: () => insertUserSchema,
  userLinks: () => userLinks,
  userLinksRelations: () => userLinksRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  theme: text("theme").default("default"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userLinks = pgTable("user_links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var usersRelations = relations(users, ({ many }) => ({
  links: many(userLinks)
}));
var userLinksRelations = relations(userLinks, ({ one }) => ({
  user: one(users, {
    fields: [userLinks.userId],
    references: [users.id]
  })
}));
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique()
});
var contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  readTime: integer("read_time"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users, {
  displayName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  theme: z.string().optional()
}).omit({
  id: true,
  createdAt: true
});
var insertUserLinkSchema = createInsertSchema(userLinks).omit({
  id: true,
  createdAt: true
});
var insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true
});
var insertContentSchema = createInsertSchema(contents).omit({
  id: true,
  createdAt: true,
  views: true,
  likes: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
var PostgresSessionStore = connectPg(session);
var DatabaseStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, userData) {
    const [updatedUser] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return updatedUser;
  }
  // User links methods
  async getUserLinks(userId) {
    return db.select().from(userLinks).where(eq(userLinks.userId, userId)).orderBy(userLinks.order);
  }
  async getUserWithLinks(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) return void 0;
    const links = await this.getUserLinks(user.id);
    return {
      ...user,
      links
    };
  }
  async createUserLink(link) {
    const [newLink] = await db.insert(userLinks).values(link).returning();
    return newLink;
  }
  async updateUserLink(id, link) {
    const [updatedLink] = await db.update(userLinks).set(link).where(eq(userLinks.id, id)).returning();
    return updatedLink;
  }
  async deleteUserLink(id) {
    const [deletedLink] = await db.delete(userLinks).where(eq(userLinks.id, id)).returning();
    return !!deletedLink;
  }
  // Category methods
  async getAllCategories() {
    return db.select().from(categories);
  }
  async getCategory(id) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  async getCategoryBySlug(slug) {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }
  async createCategory(category) {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
  // Content methods
  async getAllContents() {
    const result = await db.select({
      content: contents,
      category: categories
    }).from(contents).innerJoin(categories, eq(contents.categoryId, categories.id));
    return result.map(({ content, category }) => ({
      ...content,
      category
    }));
  }
  async getContent(id) {
    const [result] = await db.select({
      content: contents,
      category: categories
    }).from(contents).innerJoin(categories, eq(contents.categoryId, categories.id)).where(eq(contents.id, id));
    if (!result) return void 0;
    return {
      ...result.content,
      category: result.category
    };
  }
  async getContentsByCategory(categorySlug) {
    const [category] = await db.select().from(categories).where(eq(categories.slug, categorySlug));
    if (!category) return [];
    const result = await db.select({
      content: contents,
      category: categories
    }).from(contents).innerJoin(categories, eq(contents.categoryId, categories.id)).where(eq(contents.categoryId, category.id));
    return result.map(({ content, category: category2 }) => ({
      ...content,
      category: category2
    }));
  }
  async getFeaturedContents() {
    const result = await db.select({
      content: contents,
      category: categories
    }).from(contents).innerJoin(categories, eq(contents.categoryId, categories.id)).where(eq(contents.featured, true));
    return result.map(({ content, category }) => ({
      ...content,
      category
    }));
  }
  async getLatestContents() {
    const result = await db.select({
      content: contents,
      category: categories
    }).from(contents).innerJoin(categories, eq(contents.categoryId, categories.id)).orderBy(desc(contents.createdAt)).limit(8);
    return result.map(({ content, category }) => ({
      ...content,
      category
    }));
  }
  async createContent(content) {
    const [newContent] = await db.insert(contents).values(content).returning();
    return newContent;
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "witherco-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3
      // 30 days
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/routes.ts
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/user/links", isAuthenticated, async (req, res) => {
    try {
      const links = await storage.getUserLinks(req.user.id);
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user links" });
    }
  });
  app2.put("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      const { displayName, bio, theme } = req.body;
      const user = await storage.updateUser(req.user.id, {
        displayName,
        bio,
        theme
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app2.post("/api/user/links", isAuthenticated, async (req, res) => {
    try {
      const newLink = await storage.createUserLink({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(newLink);
    } catch (error) {
      res.status(500).json({ message: "Failed to create link" });
    }
  });
  app2.put("/api/user/links/:id", isAuthenticated, async (req, res) => {
    try {
      const linkId = parseInt(req.params.id);
      const updatedLink = await storage.updateUserLink(linkId, req.body);
      if (!updatedLink) {
        return res.status(404).json({ message: "Link not found" });
      }
      res.json(updatedLink);
    } catch (error) {
      res.status(500).json({ message: "Failed to update link" });
    }
  });
  app2.delete("/api/user/links/:id", isAuthenticated, async (req, res) => {
    try {
      const linkId = parseInt(req.params.id);
      const success = await storage.deleteUserLink(linkId);
      if (!success) {
        return res.status(404).json({ message: "Link not found" });
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete link" });
    }
  });
  app2.get("/api/:username", async (req, res) => {
    try {
      const user = await storage.getUserWithLinks(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getAllCategories();
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/contents", async (req, res) => {
    try {
      const { category } = req.query;
      let contents2;
      if (category && category !== "all") {
        contents2 = await storage.getContentsByCategory(category);
      } else {
        contents2 = await storage.getAllContents();
      }
      res.json(contents2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contents" });
    }
  });
  app2.get("/api/contents/featured", async (req, res) => {
    try {
      const featuredContents = await storage.getFeaturedContents();
      res.json(featuredContents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured contents" });
    }
  });
  app2.get("/api/contents/latest", async (req, res) => {
    try {
      const latestContents = await storage.getLatestContents();
      res.json(latestContents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest contents" });
    }
  });
  app2.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      res.json({ message: "Subscription successful" });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });
  await initializeData();
  const httpServer = createServer(app2);
  return httpServer;
}
async function initializeData() {
  try {
    const existingCategories = await storage.getAllCategories();
    if (existingCategories.length === 0) {
      const categories2 = [
        { name: "Technology", slug: "technology" },
        { name: "Travel", slug: "travel" },
        { name: "Food", slug: "food" },
        { name: "Health", slug: "health" },
        { name: "Art & Design", slug: "art" },
        { name: "Science", slug: "science" }
      ];
      for (const category of categories2) {
        await storage.createCategory(category);
      }
      const allCategories = await storage.getAllCategories();
      const contents2 = [
        {
          title: "The Future of AI in Everyday Life",
          description: "Exploring how artificial intelligence is transforming our daily routines and what to expect in the coming years.",
          imageUrl: "https://images.unsplash.com/photo-1526498460520-4c246339dccb",
          categoryId: allCategories.find((c) => c.slug === "technology")?.id || 1,
          readTime: 5,
          featured: true,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          title: "Hidden Gems: Unexplored Mountain Trails",
          description: "Discover breathtaking mountain trails that remain untouched by mass tourism and offer authentic experiences.",
          imageUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
          categoryId: allCategories.find((c) => c.slug === "travel")?.id || 2,
          readTime: 8,
          featured: true,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          title: "Simple Meal Prep for Busy Professionals",
          description: "Learn how to prepare nutritious meals for the entire week in just two hours, saving time and promoting healthier eating habits.",
          imageUrl: "https://images.unsplash.com/photo-1565299507177-b0ac66763828",
          categoryId: allCategories.find((c) => c.slug === "food")?.id || 3,
          readTime: 4,
          featured: true,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          title: "5-Minute Meditation Techniques",
          description: "Quick meditation techniques that can be practiced anywhere to reduce stress and improve focus.",
          imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
          categoryId: allCategories.find((c) => c.slug === "health")?.id || 4,
          readTime: 3,
          featured: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          title: "Recent Breakthroughs in Astronomy",
          description: "The latest discoveries and breakthroughs in the field of astronomy and space exploration.",
          imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
          categoryId: allCategories.find((c) => c.slug === "science")?.id || 6,
          readTime: 6,
          featured: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          title: "Digital Art Fundamentals",
          description: "Basic principles and techniques for creating stunning digital artwork.",
          imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
          categoryId: allCategories.find((c) => c.slug === "art")?.id || 5,
          readTime: 7,
          featured: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          title: "Next-Gen Gaming Hardware",
          description: "A look at the latest gaming hardware and technologies that are revolutionizing the gaming industry.",
          imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
          categoryId: allCategories.find((c) => c.slug === "technology")?.id || 1,
          readTime: 5,
          featured: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ];
      for (const content of contents2) {
        await storage.createContent(content);
      }
    }
  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
