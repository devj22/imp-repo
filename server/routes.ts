import express, { type Express } from "express";
import type { Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPropertySchema, 
  insertBlogPostSchema, 
  insertMessageSchema, 
  insertTestimonialSchema 
} from "@shared/schema";
import { z } from "zod";
import bcrypt from 'bcrypt';

// Simple JWT implementation for admin authentication
import jwt from 'jsonwebtoken';

// Use environment variable for JWT secret in production, fallback to a default in development
const JWT_SECRET = process.env.JWT_SECRET || 'nainaland-secret-key';

// Log warning if using default JWT secret in production
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: Using default JWT_SECRET in production environment. Set JWT_SECRET environment variable for better security.');
}

function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
}

// Middleware to check admin authentication
function authMiddleware(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes (prefix with /api)
  const apiRouter = express.Router();

  // Auth routes
  apiRouter.post('/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = generateToken(user.id);
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: 'Server error during login' });
    }
  });

  // Property routes
  apiRouter.get('/properties', async (req: Request, res: Response) => {
    try {
      const { type, featured } = req.query;
      
      let properties;
      if (type) {
        properties = await storage.getPropertiesByType(type as string);
      } else if (featured === 'true') {
        properties = await storage.getFeaturedProperties();
      } else {
        properties = await storage.getAllProperties();
      }
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch properties' });
    }
  });

  apiRouter.get('/properties/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getPropertyById(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch property' });
    }
  });

  apiRouter.post('/properties', authMiddleware, async (req: Request, res: Response) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const newProperty = await storage.createProperty(propertyData);
      res.status(201).json(newProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid property data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create property' });
    }
  });

  apiRouter.put('/properties/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const property = await storage.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      const updatedProperty = await storage.updateProperty(id, updateData);
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update property' });
    }
  });

  apiRouter.delete('/properties/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProperty(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete property' });
    }
  });

  // Blog post routes
  apiRouter.get('/blogs', async (req: Request, res: Response) => {
    try {
      const blogs = await storage.getAllBlogPosts();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  apiRouter.get('/blogs/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const blog = await storage.getBlogPostById(id);
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  apiRouter.post('/blogs', authMiddleware, async (req: Request, res: Response) => {
    try {
      const blogData = insertBlogPostSchema.parse(req.body);
      const newBlog = await storage.createBlogPost(blogData);
      res.status(201).json(newBlog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid blog data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create blog post' });
    }
  });

  apiRouter.put('/blogs/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const blog = await storage.getBlogPostById(id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      const updatedBlog = await storage.updateBlogPost(id, updateData);
      res.json(updatedBlog);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  });

  apiRouter.delete('/blogs/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete blog post' });
    }
  });

  // Message routes
  apiRouter.get('/messages', authMiddleware, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  apiRouter.post('/messages', async (req: Request, res: Response) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const newMessage = await storage.createMessage(messageData);
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid message data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create message' });
    }
  });

  apiRouter.put('/messages/:id/read', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { isRead } = req.body;
      
      if (typeof isRead !== 'boolean') {
        return res.status(400).json({ message: 'isRead field must be a boolean' });
      }
      
      const updatedMessage = await storage.updateMessageReadStatus(id, isRead);
      
      if (!updatedMessage) {
        return res.status(404).json({ message: 'Message not found' });
      }
      
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update message read status' });
    }
  });

  apiRouter.delete('/messages/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMessage(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Message not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete message' });
    }
  });

  // Testimonial routes
  apiRouter.get('/testimonials', async (req: Request, res: Response) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch testimonials' });
    }
  });

  apiRouter.post('/testimonials', authMiddleware, async (req: Request, res: Response) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(newTestimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid testimonial data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create testimonial' });
    }
  });

  app.use('/api', apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
