import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertUserLinkSchema } from "@shared/schema";

// Middleware to ensure user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // User Profile API
  app.get("/api/user/links", isAuthenticated, async (req, res) => {
    try {
      const links = await storage.getUserLinks(req.user!.id);
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user links" });
    }
  });
  
  app.put("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      const { displayName, bio, theme } = req.body;
      const user = await storage.updateUser(req.user!.id, { 
        displayName, 
        bio, 
        theme 
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  app.post("/api/user/links", isAuthenticated, async (req, res) => {
    try {
      const newLink = await storage.createUserLink({
        ...req.body,
        userId: req.user!.id
      });
      res.status(201).json(newLink);
    } catch (error) {
      res.status(500).json({ message: "Failed to create link" });
    }
  });
  
  app.put("/api/user/links/:id", isAuthenticated, async (req, res) => {
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
  
  app.delete("/api/user/links/:id", isAuthenticated, async (req, res) => {
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
  
  // Public Profile API
  app.get("/api/:username", async (req, res) => {
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
  
  // Categories API (legacy)
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Content API
  app.get("/api/contents", async (req, res) => {
    try {
      const { category } = req.query;
      let contents;
      
      if (category && category !== "all") {
        contents = await storage.getContentsByCategory(category as string);
      } else {
        contents = await storage.getAllContents();
      }
      
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contents" });
    }
  });

  app.get("/api/contents/featured", async (req, res) => {
    try {
      const featuredContents = await storage.getFeaturedContents();
      res.json(featuredContents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured contents" });
    }
  });

  app.get("/api/contents/latest", async (req, res) => {
    try {
      const latestContents = await storage.getLatestContents();
      res.json(latestContents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest contents" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      
      // In a real app, we would store the email in the database
      // For now, we just return success
      res.json({ message: "Subscription successful" });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Initialize sample data if needed
  await initializeData();

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize sample data
async function initializeData() {
  try {
    // Check if we already have categories
    const existingCategories = await storage.getAllCategories();
    
    if (existingCategories.length === 0) {
      // Add sample categories
      const categories = [
        { name: "Technology", slug: "technology" },
        { name: "Travel", slug: "travel" },
        { name: "Food", slug: "food" },
        { name: "Health", slug: "health" },
        { name: "Art & Design", slug: "art" },
        { name: "Science", slug: "science" }
      ];
      
      for (const category of categories) {
        await storage.createCategory(category);
      }
      
      // Now that we have categories, let's add some content
      const allCategories = await storage.getAllCategories();
      
      // Sample content
      const contents = [
        {
          title: "The Future of AI in Everyday Life",
          description: "Exploring how artificial intelligence is transforming our daily routines and what to expect in the coming years.",
          imageUrl: "https://images.unsplash.com/photo-1526498460520-4c246339dccb",
          categoryId: allCategories.find(c => c.slug === "technology")?.id || 1,
          readTime: 5,
          featured: true,
          createdAt: new Date().toISOString()
        },
        {
          title: "Hidden Gems: Unexplored Mountain Trails",
          description: "Discover breathtaking mountain trails that remain untouched by mass tourism and offer authentic experiences.",
          imageUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
          categoryId: allCategories.find(c => c.slug === "travel")?.id || 2,
          readTime: 8,
          featured: true,
          createdAt: new Date().toISOString()
        },
        {
          title: "Simple Meal Prep for Busy Professionals",
          description: "Learn how to prepare nutritious meals for the entire week in just two hours, saving time and promoting healthier eating habits.",
          imageUrl: "https://images.unsplash.com/photo-1565299507177-b0ac66763828",
          categoryId: allCategories.find(c => c.slug === "food")?.id || 3,
          readTime: 4,
          featured: true,
          createdAt: new Date().toISOString()
        },
        {
          title: "5-Minute Meditation Techniques",
          description: "Quick meditation techniques that can be practiced anywhere to reduce stress and improve focus.",
          imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
          categoryId: allCategories.find(c => c.slug === "health")?.id || 4,
          readTime: 3,
          featured: false,
          createdAt: new Date().toISOString()
        },
        {
          title: "Recent Breakthroughs in Astronomy",
          description: "The latest discoveries and breakthroughs in the field of astronomy and space exploration.",
          imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
          categoryId: allCategories.find(c => c.slug === "science")?.id || 6,
          readTime: 6,
          featured: false,
          createdAt: new Date().toISOString()
        },
        {
          title: "Digital Art Fundamentals",
          description: "Basic principles and techniques for creating stunning digital artwork.",
          imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
          categoryId: allCategories.find(c => c.slug === "art")?.id || 5,
          readTime: 7,
          featured: false,
          createdAt: new Date().toISOString()
        },
        {
          title: "Next-Gen Gaming Hardware",
          description: "A look at the latest gaming hardware and technologies that are revolutionizing the gaming industry.",
          imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
          categoryId: allCategories.find(c => c.slug === "technology")?.id || 1,
          readTime: 5,
          featured: false,
          createdAt: new Date().toISOString()
        }
      ];
      
      for (const content of contents) {
        await storage.createContent(content);
      }
    }
  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
}
