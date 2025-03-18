import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  projectScope: text("project_scope"),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  author: text("author").notNull(),
  category: text("category").default("general"),
  tags: text("tags").array(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  company: text("company"),
  testimonial: text("testimonial").notNull(),
  rating: integer("rating").notNull(),
  projectType: text("project_type").notNull(),
  imageUrl: text("image_url"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolioProjects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrls: text("image_urls").array(),
  clientName: text("client_name"),
  completionDate: text("completion_date"),
  location: text("location"),
  services: text("services").array(),
  testimonialId: integer("testimonial_id"),
  beforeImages: text("before_images").array(),
  afterImages: text("after_images").array(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const metaTags = pgTable("meta_tags", {
  id: serial("id").primaryKey(),
  pagePath: text("page_path").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  keywords: text("keywords"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  phone: true,
  service: true,
  message: true,
}).extend({
  budget: z.string().optional(),
  timeline: z.string().optional(),
  projectScope: z.string().optional(),
});

export const blogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  summary: true,
  content: true,
  author: true,
}).extend({
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const testimonialSchema = createInsertSchema(testimonials).pick({
  clientName: true,
  company: true,
  testimonial: true,
  rating: true,
  projectType: true,
}).extend({
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const portfolioProjectSchema = createInsertSchema(portfolioProjects).pick({
  title: true,
  description: true,
  category: true,
  clientName: true,
  completionDate: true,
  location: true,
}).extend({
  imageUrls: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required"),
  services: z.array(z.string()).optional(),
  testimonialId: z.number().optional(),
  beforeImages: z.array(z.string().url("Must be a valid URL")).optional(),
  afterImages: z.array(z.string().url("Must be a valid URL")).optional(),
  featured: z.boolean().optional(),
});

export const metaTagSchema = createInsertSchema(metaTags).pick({
  pagePath: true,
  title: true,
  description: true,
}).extend({
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertBlogPost = z.infer<typeof blogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertTestimonial = z.infer<typeof testimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertPortfolioProject = z.infer<typeof portfolioProjectSchema>;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;

export type InsertMetaTag = z.infer<typeof metaTagSchema>;
export type MetaTag = typeof metaTags.$inferSelect;

export type Login = z.infer<typeof loginSchema>;
