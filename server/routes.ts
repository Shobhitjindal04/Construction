import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  loginSchema, 
  blogPostSchema,
  testimonialSchema,
  portfolioProjectSchema,
  metaTagSchema
} from "@shared/schema";
import { ZodError } from "zod";
import * as XLSX from "xlsx";
import * as path from "path";
import * as fs from "fs";
import * as bcrypt from "bcryptjs";
import multer from "multer";
import express from "express";

// Set up multer for file uploads (images for blog posts, testimonials, and portfolio projects)
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!') as any, false);
    }
  }
});

// Create a directory for storing Excel exports
const excelDir = path.join(process.cwd(), "exports");
if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir, { recursive: true });
}

// Auth middleware to protect admin routes
function authMiddleware(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  
  // For simplicity, we're using a hardcoded token
  // In a real app, you would verify the token properly
  if (token !== "admin-token") {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
  
  next();
}

// Helper function to download Excel file
function downloadExcelFile(res: Response, workbook: any, fileName: string, filePath: string) {
  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      // Clean up the file regardless of download success
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else {
      // Clean up the file after successful download
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }, 5000); // Delete after 5 seconds
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================
  // Contact Form Endpoints
  // ============================================
  
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertContactSchema.parse(req.body);
      
      // Store the contact submission
      const submission = await storage.createContactSubmission(validatedData);
      
      // Return success response
      res.status(201).json({ 
        message: "Contact form submitted successfully", 
        id: submission.id 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        // Handle other errors
        console.error("Error processing contact form:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get all contact submissions (for admin purposes)
  app.get("/api/contact", authMiddleware, async (_req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.status(200).json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get a single contact submission
  app.get("/api/contact/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contact submission ID" });
      }
      
      const submission = await storage.getContactSubmission(id);
      if (!submission) {
        return res.status(404).json({ message: "Contact submission not found" });
      }
      
      res.status(200).json(submission);
    } catch (error) {
      console.error("Error fetching contact submission:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Mark contact submission as read
  app.patch("/api/contact/:id/read", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contact submission ID" });
      }
      
      const submission = await storage.markContactSubmissionAsRead(id);
      res.status(200).json(submission);
    } catch (error) {
      console.error("Error marking contact submission as read:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Export contact submissions to Excel
  app.get("/api/contact/export", authMiddleware, async (_req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(submissions.map(sub => ({
        ID: sub.id,
        Name: sub.name,
        Email: sub.email,
        Phone: sub.phone,
        Service: sub.service,
        Message: sub.message,
        Budget: sub.budget || "N/A",
        Timeline: sub.timeline || "N/A",
        "Project Scope": sub.projectScope || "N/A",
        "Read Status": sub.isRead ? "Read" : "Unread",
        "Submitted At": sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "N/A"
      })));
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Submissions");
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `contact_submissions_${timestamp}.xlsx`;
      const filePath = path.join(excelDir, fileName);
      
      // Write the workbook to a file
      XLSX.writeFile(workbook, filePath);
      
      // Send the file as a response
      downloadExcelFile(res, workbook, fileName, filePath);
    } catch (error) {
      console.error("Error exporting contact submissions:", error);
      res.status(500).json({ message: "Error exporting contact submissions" });
    }
  });

  // ============================================
  // Authentication Endpoints
  // ============================================
  
  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // For simplicity, hardcoded admin credentials
      // In a real app, you would check against database
      if (username === "admin" && password === "admin123") {
        res.status(200).json({
          message: "Login successful",
          token: "admin-token", // In a real app, generate a proper JWT
          user: { username, role: "admin" }
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // ============================================
  // Blog Post Endpoints
  // ============================================
  
  // Get all published blog posts
  app.get("/api/blog", async (_req, res) => {
    try {
      const blogPosts = await storage.getPublishedBlogPosts();
      res.status(200).json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all blog posts (including unpublished) - admin only
  app.get("/api/admin/blog", authMiddleware, async (_req, res) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      res.status(200).json(blogPosts);
    } catch (error) {
      console.error("Error fetching all blog posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get blog posts by category
  app.get("/api/blog/category/:category", async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPostsByCategory(req.params.category);
      res.status(200).json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts by category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Search blog posts
  app.get("/api/blog/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const blogPosts = await storage.searchBlogPosts(query);
      res.status(200).json(blogPosts);
    } catch (error) {
      console.error("Error searching blog posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get single blog post
  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const blogPost = await storage.getBlogPost(id);
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Only return published posts unless admin
      if (!blogPost.isPublished) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token || token !== "admin-token") {
          return res.status(404).json({ message: "Blog post not found" });
        }
      }
      
      res.status(200).json(blogPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create blog post (admin only)
  app.post("/api/blog", authMiddleware, async (req, res) => {
    try {
      const validatedData = blogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(validatedData);
      
      res.status(201).json({
        message: "Blog post created successfully",
        blogPost
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Error creating blog post:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Update blog post (admin only)
  app.patch("/api/blog/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const existingPost = await storage.getBlogPost(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      const validatedData = blogPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updateBlogPost(id, validatedData);
      
      res.status(200).json({
        message: "Blog post updated successfully",
        blogPost: updatedPost
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Error updating blog post:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Delete blog post (admin only)
  app.delete("/api/blog/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const existingPost = await storage.getBlogPost(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      await storage.deleteBlogPost(id);
      res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Export blog posts to Excel (admin only)
  app.get("/api/blog/export", authMiddleware, async (_req, res) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(blogPosts.map(post => ({
        ID: post.id,
        Title: post.title,
        Summary: post.summary,
        Category: post.category || "N/A",
        Author: post.author,
        Status: post.isPublished ? "Published" : "Draft",
        "Created At": post.createdAt ? new Date(post.createdAt).toLocaleString() : "N/A",
        "Updated At": post.updatedAt ? new Date(post.updatedAt).toLocaleString() : "N/A"
      })));
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Blog Posts");
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `blog_posts_${timestamp}.xlsx`;
      const filePath = path.join(excelDir, fileName);
      
      // Write the workbook to a file
      XLSX.writeFile(workbook, filePath);
      
      // Send the file as a response
      downloadExcelFile(res, workbook, fileName, filePath);
    } catch (error) {
      console.error("Error exporting blog posts:", error);
      res.status(500).json({ message: "Error exporting blog posts" });
    }
  });

  // ============================================
  // Testimonial Endpoints
  // ============================================
  
  // Get all approved testimonials
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonials = await storage.getApprovedTestimonials();
      res.status(200).json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all testimonials (including unapproved) - admin only
  app.get("/api/admin/testimonials", authMiddleware, async (_req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.status(200).json(testimonials);
    } catch (error) {
      console.error("Error fetching all testimonials:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get testimonials by project type
  app.get("/api/testimonials/type/:projectType", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonialsByProjectType(req.params.projectType);
      res.status(200).json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials by project type:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get single testimonial
  app.get("/api/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid testimonial ID" });
      }
      
      const testimonial = await storage.getTestimonial(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      // Only return approved testimonials unless admin
      if (!testimonial.isApproved) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token || token !== "admin-token") {
          return res.status(404).json({ message: "Testimonial not found" });
        }
      }
      
      res.status(200).json(testimonial);
    } catch (error) {
      console.error("Error fetching testimonial:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Submit new testimonial
  app.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = testimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      
      res.status(201).json({
        message: "Thank you for your testimonial! It will be reviewed by our team and published soon.",
        testimonialId: testimonial.id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Error submitting testimonial:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Update testimonial (admin only)
  app.patch("/api/testimonials/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid testimonial ID" });
      }
      
      const existingTestimonial = await storage.getTestimonial(id);
      if (!existingTestimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      const validatedData = testimonialSchema.partial().parse(req.body);
      const updatedTestimonial = await storage.updateTestimonial(id, validatedData);
      
      res.status(200).json({
        message: "Testimonial updated successfully",
        testimonial: updatedTestimonial
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Error updating testimonial:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Approve testimonial (admin only)
  app.patch("/api/testimonials/:id/approve", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid testimonial ID" });
      }
      
      const testimonial = await storage.approveTestimonial(id);
      res.status(200).json({
        message: "Testimonial approved successfully",
        testimonial
      });
    } catch (error) {
      console.error("Error approving testimonial:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete testimonial (admin only)
  app.delete("/api/testimonials/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid testimonial ID" });
      }
      
      const existingTestimonial = await storage.getTestimonial(id);
      if (!existingTestimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      await storage.deleteTestimonial(id);
      res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Export testimonials to Excel (admin only)
  app.get("/api/testimonials/export", authMiddleware, async (_req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(testimonials.map(t => ({
        ID: t.id,
        Client: t.clientName,
        Company: t.company || "N/A",
        "Project Type": t.projectType,
        Rating: t.rating,
        Status: t.isApproved ? "Approved" : "Pending",
        "Submitted At": t.createdAt ? new Date(t.createdAt).toLocaleString() : "N/A"
      })));
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Testimonials");
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `testimonials_${timestamp}.xlsx`;
      const filePath = path.join(excelDir, fileName);
      
      // Write the workbook to a file
      XLSX.writeFile(workbook, filePath);
      
      // Send the file as a response
      downloadExcelFile(res, workbook, fileName, filePath);
    } catch (error) {
      console.error("Error exporting testimonials:", error);
      res.status(500).json({ message: "Error exporting testimonials" });
    }
  });
  
  // ============================================
  // Portfolio Project Endpoints
  // ============================================
  
  // Get all portfolio projects
  app.get("/api/portfolio", async (_req, res) => {
    try {
      const projects = await storage.getAllPortfolioProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching portfolio projects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get featured portfolio projects
  app.get("/api/portfolio/featured", async (_req, res) => {
    try {
      const projects = await storage.getFeaturedPortfolioProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching featured portfolio projects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get portfolio projects by category
  app.get("/api/portfolio/category/:category", async (req, res) => {
    try {
      const projects = await storage.getPortfolioProjectsByCategory(req.params.category);
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching portfolio projects by category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get single portfolio project
  app.get("/api/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid portfolio project ID" });
      }
      
      const project = await storage.getPortfolioProject(id);
      if (!project) {
        return res.status(404).json({ message: "Portfolio project not found" });
      }
      
      res.status(200).json(project);
    } catch (error) {
      console.error("Error fetching portfolio project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create portfolio project (admin only)
  app.post("/api/portfolio", authMiddleware, async (req, res) => {
    try {
      const validatedData = portfolioProjectSchema.parse(req.body);
      const project = await storage.createPortfolioProject(validatedData);
      
      res.status(201).json({
        message: "Portfolio project created successfully",
        project
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Error creating portfolio project:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Update portfolio project (admin only)
  app.patch("/api/portfolio/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid portfolio project ID" });
      }
      
      const existingProject = await storage.getPortfolioProject(id);
      if (!existingProject) {
        return res.status(404).json({ message: "Portfolio project not found" });
      }
      
      const validatedData = portfolioProjectSchema.partial().parse(req.body);
      const updatedProject = await storage.updatePortfolioProject(id, validatedData);
      
      res.status(200).json({
        message: "Portfolio project updated successfully",
        project: updatedProject
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Error updating portfolio project:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Delete portfolio project (admin only)
  app.delete("/api/portfolio/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid portfolio project ID" });
      }
      
      const existingProject = await storage.getPortfolioProject(id);
      if (!existingProject) {
        return res.status(404).json({ message: "Portfolio project not found" });
      }
      
      await storage.deletePortfolioProject(id);
      res.status(200).json({ message: "Portfolio project deleted successfully" });
    } catch (error) {
      console.error("Error deleting portfolio project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Export portfolio projects to Excel (admin only)
  app.get("/api/portfolio/export", authMiddleware, async (_req, res) => {
    try {
      const projects = await storage.getAllPortfolioProjects();
      
      // Create a new workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(projects.map(p => ({
        ID: p.id,
        Title: p.title,
        Category: p.category,
        Client: p.clientName || "N/A",
        Location: p.location || "N/A",
        "Completion Date": p.completionDate || "N/A",
        Featured: p.featured ? "Yes" : "No",
        "Created At": p.createdAt ? new Date(p.createdAt).toLocaleString() : "N/A",
        "Updated At": p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "N/A"
      })));
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Portfolio Projects");
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `portfolio_projects_${timestamp}.xlsx`;
      const filePath = path.join(excelDir, fileName);
      
      // Write the workbook to a file
      XLSX.writeFile(workbook, filePath);
      
      // Send the file as a response
      downloadExcelFile(res, workbook, fileName, filePath);
    } catch (error) {
      console.error("Error exporting portfolio projects:", error);
      res.status(500).json({ message: "Error exporting portfolio projects" });
    }
  });
  
  // ============================================
  // Meta Tags Endpoints
  // ============================================
  
  // Get meta tags for a specific page
  app.get("/api/meta-tags/:pagePath", async (req, res) => {
    try {
      const pagePath = req.params.pagePath;
      const metaTags = await storage.getMetaTagByPath(pagePath);
      
      if (!metaTags) {
        return res.status(404).json({ message: "Meta tags not found for this page" });
      }
      
      res.status(200).json(metaTags);
    } catch (error) {
      console.error("Error fetching meta tags:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all meta tags (admin only)
  app.get("/api/meta-tags", authMiddleware, async (_req, res) => {
    try {
      const metaTags = await storage.getAllMetaTags();
      res.status(200).json(metaTags);
    } catch (error) {
      console.error("Error fetching all meta tags:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create meta tags for a page (admin only)
  app.post("/api/meta-tags", authMiddleware, async (req, res) => {
    try {
      const validatedData = metaTagSchema.parse(req.body);
      
      // Check if meta tags already exist for this page
      const existingMetaTags = await storage.getMetaTagByPath(validatedData.pagePath);
      if (existingMetaTags) {
        return res.status(409).json({ 
          message: "Meta tags already exist for this page. Please use PATCH to update them.",
          id: existingMetaTags.id
        });
      }
      
      const metaTags = await storage.createMetaTag(validatedData);
      
      res.status(201).json({
        message: "Meta tags created successfully",
        metaTags
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Error creating meta tags:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Update meta tags (admin only)
  app.patch("/api/meta-tags/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meta tags ID" });
      }
      
      const existingMetaTags = await storage.getMetaTagByPath(req.body.pagePath);
      if (existingMetaTags && existingMetaTags.id !== id) {
        return res.status(409).json({ 
          message: "Another page is already using this path. Each page path must be unique.",
        });
      }
      
      const validatedData = metaTagSchema.partial().parse(req.body);
      const updatedMetaTags = await storage.updateMetaTag(id, validatedData);
      
      res.status(200).json({
        message: "Meta tags updated successfully",
        metaTags: updatedMetaTags
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Error updating meta tags:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Delete meta tags (admin only)
  app.delete("/api/meta-tags/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meta tags ID" });
      }
      
      await storage.deleteMetaTag(id);
      res.status(200).json({ message: "Meta tags deleted successfully" });
    } catch (error) {
      console.error("Error deleting meta tags:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);

  return httpServer;
}
