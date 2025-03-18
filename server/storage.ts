import { 
  users, 
  type User, 
  type InsertUser, 
  type ContactSubmission, 
  type InsertContact, 
  type BlogPost, 
  type InsertBlogPost,
  type Testimonial,
  type InsertTestimonial,
  type PortfolioProject,
  type InsertPortfolioProject,
  type MetaTag,
  type InsertMetaTag
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact form methods
  createContactSubmission(submission: InsertContact): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  getContactSubmission(id: number): Promise<ContactSubmission | undefined>;
  markContactSubmissionAsRead(id: number): Promise<ContactSubmission>;
  
  // Blog post methods
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  searchBlogPosts(query: string): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Testimonial methods
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getAllTestimonials(): Promise<Testimonial[]>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  getTestimonialsByProjectType(projectType: string): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  updateTestimonial(id: number, updates: Partial<InsertTestimonial>): Promise<Testimonial>;
  approveTestimonial(id: number): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<void>;
  
  // Portfolio project methods
  createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject>;
  getAllPortfolioProjects(): Promise<PortfolioProject[]>;
  getPortfolioProjectsByCategory(category: string): Promise<PortfolioProject[]>;
  getFeaturedPortfolioProjects(): Promise<PortfolioProject[]>;
  getPortfolioProject(id: number): Promise<PortfolioProject | undefined>;
  updatePortfolioProject(id: number, updates: Partial<InsertPortfolioProject>): Promise<PortfolioProject>;
  deletePortfolioProject(id: number): Promise<void>;
  
  // Meta tags methods
  createMetaTag(metaTag: InsertMetaTag): Promise<MetaTag>;
  getAllMetaTags(): Promise<MetaTag[]>;
  getMetaTagByPath(pagePath: string): Promise<MetaTag | undefined>;
  updateMetaTag(id: number, updates: Partial<InsertMetaTag>): Promise<MetaTag>;
  deleteMetaTag(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private blogPosts: Map<number, BlogPost>;
  private testimonials: Map<number, Testimonial>;
  private portfolioProjects: Map<number, PortfolioProject>;
  private metaTags: Map<number, MetaTag>;
  
  private userCurrentId: number;
  private contactCurrentId: number;
  private blogPostCurrentId: number;
  private testimonialCurrentId: number;
  private portfolioProjectCurrentId: number;
  private metaTagCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.blogPosts = new Map();
    this.testimonials = new Map();
    this.portfolioProjects = new Map();
    this.metaTags = new Map();
    
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.blogPostCurrentId = 1;
    this.testimonialCurrentId = 1;
    this.portfolioProjectCurrentId = 1;
    this.metaTagCurrentId = 1;
    
    // Initialize with demo data
    this.initializeBlogPosts();
    this.initializeTestimonials();
    this.initializePortfolioProjects();
    this.initializeMetaTags();
  }
  
  private initializeBlogPosts() {
    const demoPosts: InsertBlogPost[] = [
      {
        title: "The Future of Sustainable Construction",
        summary: "Exploring eco-friendly building materials and methods that are shaping the future of construction.",
        content: "Sustainable construction is no longer just a trend but a necessity as our industry faces increasing environmental challenges. This blog post explores the latest innovations in eco-friendly building materials and methods that are transforming how we build.\n\nInnovative Materials\nFrom cross-laminated timber to recycled concrete aggregates, sustainable materials are reducing our carbon footprint while maintaining structural integrity and aesthetic appeal.\n\nEnergy Efficiency\nPassive house designs and new insulation technologies are drastically reducing energy consumption in both residential and commercial buildings.\n\nWater Conservation\nSmart water systems and rainwater harvesting are becoming standard features in forward-thinking construction projects.\n\nThe Bottom Line\nWhile sustainable construction may have higher upfront costs, the long-term savings and environmental benefits make it a wise investment for builders and clients alike.",
        imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        author: "Michael Green",
        category: "Sustainability",
        tags: ["green-building", "innovation", "eco-friendly"],
        seoTitle: "The Future of Sustainable Construction: Eco-Friendly Building Solutions",
        seoDescription: "Discover the latest innovations in sustainable construction, from eco-friendly materials to energy-efficient designs that are shaping the future of building."
      },
      {
        title: "5 Tips for Choosing the Right Contractor",
        summary: "Essential advice for homeowners looking to hire the perfect contractor for their renovation project.",
        content: "Selecting the right contractor is perhaps the most critical decision you'll make in your construction or renovation project. Here are five essential tips to help you make the best choice:\n\n1. Check References and Portfolio\nAlways ask for references from previous clients and examples of similar projects. Don't just take their word for it - call those references and visit completed projects if possible.\n\n2. Verify Licensing and Insurance\nEnsure your contractor is properly licensed for the work they'll be performing and carries adequate insurance coverage. This protects you from liability in case of accidents or property damage.\n\n3. Get Detailed Quotes\nObtain detailed quotes from multiple contractors that break down costs for materials, labor, and other expenses. Be wary of quotes that are significantly lower than others - this often indicates cutting corners.\n\n4. Establish Clear Communication\nChoose a contractor who communicates clearly and responds promptly. Good communication throughout the project is essential for success.\n\n5. Get Everything in Writing\nEnsure all agreements, including scope of work, timeline, payment schedule, and change order procedures, are documented in a detailed contract before work begins.",
        imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        author: "Sarah Johnson",
        category: "Tips",
        tags: ["hiring", "renovation", "homeowner-advice"],
        seoTitle: "5 Essential Tips for Choosing the Right Contractor for Your Project",
        seoDescription: "Learn how to select the perfect contractor for your renovation with these 5 critical tips on vetting, comparing quotes, and ensuring quality work."
      },
      {
        title: "Modern Home Design Trends for 2023",
        summary: "The latest architectural and interior design trends that are defining modern homes this year.",
        content: "As we move through 2023, several distinctive design trends are emerging in modern home construction and renovation. Here's what's capturing the attention of architects, designers, and homeowners alike:\n\nBiophilic Design\nThe integration of nature into living spaces continues to gain momentum, with increased emphasis on natural light, indoor plants, and organic materials like stone and wood.\n\nMultifunctional Spaces\nPost-pandemic living has solidified the need for flexible spaces that can serve multiple purposes - from home offices that transform into guest rooms to living areas that accommodate exercise equipment.\n\nSmart Home Integration\nTechnology is becoming increasingly seamless in home design, with hidden charging stations, voice-activated fixtures, and integrated home automation systems.\n\nBold Color Choices\nAfter years of neutral dominance, we're seeing a return to more vibrant color palettes, especially in kitchens and bathrooms where deep blues, greens, and even black are making statements.\n\nSustainable Features\nEnergy-efficient appliances, solar panels, and water-saving fixtures aren't just environmentally responsible choices - they've become desirable design elements that homeowners proudly showcase.",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        author: "Emma Richards",
        category: "Design",
        tags: ["trends", "interior-design", "architecture"],
        seoTitle: "Top Modern Home Design Trends of 2023: What's Hot in Architecture",
        seoDescription: "Explore the cutting-edge design trends shaping modern homes in 2023, from biophilic elements to smart home technology and bold color choices."
      }
    ];
    
    demoPosts.forEach(post => {
      const id = this.blogPostCurrentId++;
      const now = new Date();
      this.blogPosts.set(id, { 
        ...post, 
        id, 
        createdAt: now, 
        updatedAt: now,
        isPublished: true,
        tags: post.tags || []
      });
    });
  }
  
  private initializeTestimonials() {
    const demoTestimonials: InsertTestimonial[] = [
      {
        clientName: "John Anderson",
        company: "Anderson Family",
        testimonial: "We couldn't be happier with our new home. The attention to detail and quality of workmanship exceeded our expectations. The team was professional, communicative, and completed the project on time and on budget.",
        rating: 5,
        projectType: "Residential",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        clientName: "Sarah Thompson",
        company: "Green Earth Organics",
        testimonial: "The team did an exceptional job on our new eco-friendly retail space. They understood our vision for a sustainable building and brought innovative solutions that helped us achieve LEED certification.",
        rating: 5,
        projectType: "Commercial",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        clientName: "Robert Chen",
        company: "Riverfront Development Corp",
        testimonial: "As a developer working on multiple projects, I value reliability and expertise. This construction company consistently delivers high-quality work across our various building sites, making them our go-to contractor.",
        rating: 4,
        projectType: "Multi-family",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        clientName: "Patricia Miller",
        company: "Miller Healthcare Group",
        testimonial: "Our medical facility renovation had complex requirements and strict timelines. The team navigated these challenges expertly, ensuring minimal disruption to our operations while delivering a state-of-the-art facility.",
        rating: 5,
        projectType: "Healthcare",
        imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ];
    
    demoTestimonials.forEach(testimonial => {
      const id = this.testimonialCurrentId++;
      const now = new Date();
      this.testimonials.set(id, {
        ...testimonial,
        id,
        isApproved: true,
        createdAt: now
      });
    });
  }
  
  private initializePortfolioProjects() {
    const demoProjects: InsertPortfolioProject[] = [
      {
        title: "Oakridge Modern Residence",
        description: "A luxurious 4,500 sq ft custom home featuring sustainable materials, energy-efficient systems, and indoor-outdoor living spaces that maximize the natural surroundings.",
        category: "Residential",
        clientName: "Anderson Family",
        completionDate: "June 2022",
        location: "Portland, OR",
        imageUrls: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        services: ["Architectural Design", "General Contracting", "Interior Design"],
        testimonialId: 1,
        beforeImages: [
          "https://images.unsplash.com/photo-1632588036395-f6c4c8827e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        afterImages: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        featured: true
      },
      {
        title: "Green Earth Retail Center",
        description: "A 12,000 sq ft LEED-certified commercial building featuring sustainable materials, solar panels, and rainwater harvesting systems.",
        category: "Commercial",
        clientName: "Green Earth Organics",
        completionDate: "November 2022",
        location: "Seattle, WA",
        imageUrls: [
          "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1604014056463-39eabaf4ea6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        services: ["Pre-Construction Planning", "Green Building", "General Contracting"],
        testimonialId: 2,
        beforeImages: [
          "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        afterImages: [
          "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        featured: true
      },
      {
        title: "Riverfront Apartments",
        description: "A 45-unit luxury apartment complex featuring modern amenities, energy-efficient systems, and stunning waterfront views.",
        category: "Multi-family",
        clientName: "Riverfront Development Corp",
        completionDate: "March 2023",
        location: "Chicago, IL",
        imageUrls: [
          "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1580041065738-e72ab61168b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        services: ["Construction Management", "Site Development", "General Contracting"],
        testimonialId: 3,
        featured: false
      },
      {
        title: "Miller Medical Center",
        description: "A state-of-the-art 25,000 sq ft medical facility renovation featuring specialized treatment rooms, advanced technology infrastructure, and patient-focused design.",
        category: "Healthcare",
        clientName: "Miller Healthcare Group",
        completionDate: "January 2023",
        location: "Boston, MA",
        imageUrls: [
          "https://images.unsplash.com/photo-1629136572950-1908cf566372?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1584466076520-a59bb34e70a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        services: ["Specialized Construction", "Renovation", "Facility Upgrading"],
        testimonialId: 4,
        featured: false
      }
    ];
    
    demoProjects.forEach(project => {
      const id = this.portfolioProjectCurrentId++;
      const now = new Date();
      this.portfolioProjects.set(id, {
        ...project,
        id,
        createdAt: now,
        updatedAt: now,
        services: project.services || [],
        beforeImages: project.beforeImages || [],
        afterImages: project.afterImages || []
      });
    });
  }
  
  private initializeMetaTags() {
    const demoMetaTags: InsertMetaTag[] = [
      {
        pagePath: "/",
        title: "Premium Construction Company | Expert Builders & Contractors",
        description: "Award-winning construction company specializing in residential, commercial, and sustainable building projects. Quality craftsmanship and reliable service.",
        keywords: "construction company, builders, contractors, residential construction, commercial construction, sustainable building",
        ogTitle: "Premium Construction Services | Expert Builders & Contractors",
        ogDescription: "Transform your vision into reality with our award-winning construction services. Specializing in residential, commercial and sustainable building projects.",
        ogImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      },
      {
        pagePath: "/about",
        title: "About Our Construction Company | Our Story & Values",
        description: "Learn about our construction company's history, values, and commitment to excellence. Meet our team of experienced professionals.",
        keywords: "construction company history, about us, construction team, construction values, building experts",
        ogTitle: "About Our Construction Company | Our Story & Values",
        ogDescription: "Discover our journey from humble beginnings to industry leaders. Meet the team that makes exceptional construction possible.",
        ogImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      },
      {
        pagePath: "/services",
        title: "Our Construction Services | Residential & Commercial Building",
        description: "Comprehensive construction services including new builds, renovations, design-build, and project management for residential and commercial projects.",
        keywords: "construction services, residential construction, commercial building, renovation services, project management",
        ogTitle: "Expert Construction Services for Any Project",
        ogDescription: "From concept to completion, our comprehensive construction services deliver exceptional results for residential, commercial and specialty projects.",
        ogImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      },
      {
        pagePath: "/portfolio",
        title: "Construction Portfolio | Our Featured Projects & Case Studies",
        description: "Browse our portfolio of completed construction projects including residential homes, commercial buildings, and specialty structures.",
        keywords: "construction portfolio, building projects, construction case studies, completed projects, construction gallery",
        ogTitle: "Construction Excellence: Our Featured Projects",
        ogDescription: "Explore our diverse portfolio of exceptional construction projects, from luxury homes to commercial developments and specialized structures.",
        ogImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      },
      {
        pagePath: "/blog",
        title: "Construction Blog | Industry Insights & Building Tips",
        description: "Stay informed with our construction blog featuring industry insights, building tips, sustainable practices, and company news.",
        keywords: "construction blog, building tips, construction insights, industry trends, sustainable building practices",
        ogTitle: "Construction Blog: Expert Insights & Building Tips",
        ogDescription: "Gain valuable insights, expert advice and the latest industry trends from our comprehensive construction and building blog.",
        ogImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      },
      {
        pagePath: "/contact",
        title: "Contact Our Construction Company | Get a Free Quote",
        description: "Contact our construction team for project inquiries, free quotes, or general information. We're ready to help with your building needs.",
        keywords: "contact construction company, construction quote, building inquiry, construction consultation",
        ogTitle: "Get in Touch | Start Your Construction Project Today",
        ogDescription: "Ready to start your project? Contact our team of construction experts for a free consultation and personalized quote.",
        ogImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      },
      {
        pagePath: "/testimonials",
        title: "Client Testimonials | What Our Customers Say",
        description: "Read testimonials from our satisfied clients about their experiences working with our construction company on various projects.",
        keywords: "construction testimonials, client reviews, customer satisfaction, construction company reviews",
        ogTitle: "Our Clients Speak: Construction Testimonials",
        ogDescription: "Discover what our clients have to say about their experience working with our construction team on residential and commercial projects.",
        ogImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      }
    ];
    
    demoMetaTags.forEach(metaTag => {
      const id = this.metaTagCurrentId++;
      const now = new Date();
      this.metaTags.set(id, {
        ...metaTag,
        id,
        updatedAt: now
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Contact form methods
  async createContactSubmission(submission: InsertContact): Promise<ContactSubmission> {
    const id = this.contactCurrentId++;
    const now = new Date();
    const contactSubmission: ContactSubmission = { 
      ...submission, 
      id,
      createdAt: now,
      isRead: false,
      budget: submission.budget || null,
      timeline: submission.timeline || null,
      projectScope: submission.projectScope || null
    };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values())
      .sort((a, b) => {
        // Sort by created date descending (newest first)
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }

  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    return this.contactSubmissions.get(id);
  }
  
  async markContactSubmissionAsRead(id: number): Promise<ContactSubmission> {
    const submission = this.contactSubmissions.get(id);
    
    if (!submission) {
      throw new Error(`Contact submission with ID ${id} not found`);
    }
    
    const updatedSubmission: ContactSubmission = {
      ...submission,
      isRead: true
    };
    
    this.contactSubmissions.set(id, updatedSubmission);
    return updatedSubmission;
  }
  
  // Blog post methods
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCurrentId++;
    const now = new Date();
    
    const blogPost: BlogPost = {
      ...post,
      id,
      createdAt: now,
      updatedAt: now,
      category: post.category || "general",
      tags: post.tags || [],
      seoTitle: post.seoTitle || null,
      seoDescription: post.seoDescription || null,
      isPublished: post.isPublished !== undefined ? post.isPublished : true,
      imageUrl: post.imageUrl || null
    };
    
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  
  async getAllBlogPosts(): Promise<BlogPost[]> {
    // Return in reverse chronological order (newest first)
    return Array.from(this.blogPosts.values()).sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }
  
  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublished)
      .sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
  
  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublished && post.category === category)
      .sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
  
  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    const lowerQuery = query.toLowerCase();
    
    return Array.from(this.blogPosts.values())
      .filter(post => {
        const titleMatch = post.title.toLowerCase().includes(lowerQuery);
        const summaryMatch = post.summary.toLowerCase().includes(lowerQuery);
        const contentMatch = post.content.toLowerCase().includes(lowerQuery);
        const categoryMatch = post.category?.toLowerCase().includes(lowerQuery);
        const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
        
        return post.isPublished && (titleMatch || summaryMatch || contentMatch || categoryMatch || tagMatch);
      })
      .sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const existingPost = this.blogPosts.get(id);
    
    if (!existingPost) {
      throw new Error(`Blog post with ID ${id} not found`);
    }
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...updates,
      updatedAt: new Date(),
      tags: updates.tags || existingPost.tags || []
    };
    
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<void> {
    if (!this.blogPosts.has(id)) {
      throw new Error(`Blog post with ID ${id} not found`);
    }
    
    this.blogPosts.delete(id);
  }
  
  // Testimonial methods
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const now = new Date();
    
    const newTestimonial: Testimonial = {
      ...testimonial,
      id,
      createdAt: now,
      isApproved: false,
      imageUrl: testimonial.imageUrl || null
    };
    
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }
  
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
  
  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .filter(testimonial => testimonial.isApproved)
      .sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
  
  async getTestimonialsByProjectType(projectType: string): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .filter(testimonial => testimonial.isApproved && testimonial.projectType === projectType)
      .sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
  
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }
  
  async updateTestimonial(id: number, updates: Partial<InsertTestimonial>): Promise<Testimonial> {
    const existingTestimonial = this.testimonials.get(id);
    
    if (!existingTestimonial) {
      throw new Error(`Testimonial with ID ${id} not found`);
    }
    
    const updatedTestimonial: Testimonial = {
      ...existingTestimonial,
      ...updates,
      imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : existingTestimonial.imageUrl
    };
    
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
  
  async approveTestimonial(id: number): Promise<Testimonial> {
    const testimonial = this.testimonials.get(id);
    
    if (!testimonial) {
      throw new Error(`Testimonial with ID ${id} not found`);
    }
    
    const approvedTestimonial: Testimonial = {
      ...testimonial,
      isApproved: true
    };
    
    this.testimonials.set(id, approvedTestimonial);
    return approvedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<void> {
    if (!this.testimonials.has(id)) {
      throw new Error(`Testimonial with ID ${id} not found`);
    }
    
    this.testimonials.delete(id);
  }
  
  // Portfolio project methods
  async createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject> {
    const id = this.portfolioProjectCurrentId++;
    const now = new Date();
    
    const newProject: PortfolioProject = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now,
      services: project.services || [],
      testimonialId: project.testimonialId || null,
      beforeImages: project.beforeImages || [],
      afterImages: project.afterImages || [],
      featured: project.featured || false
    };
    
    this.portfolioProjects.set(id, newProject);
    return newProject;
  }
  
  async getAllPortfolioProjects(): Promise<PortfolioProject[]> {
    return Array.from(this.portfolioProjects.values())
      .sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
  
  async getPortfolioProjectsByCategory(category: string): Promise<PortfolioProject[]> {
    return Array.from(this.portfolioProjects.values())
      .filter(project => project.category === category)
      .sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
  
  async getFeaturedPortfolioProjects(): Promise<PortfolioProject[]> {
    return Array.from(this.portfolioProjects.values())
      .filter(project => project.featured)
      .sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }
  
  async getPortfolioProject(id: number): Promise<PortfolioProject | undefined> {
    return this.portfolioProjects.get(id);
  }
  
  async updatePortfolioProject(id: number, updates: Partial<InsertPortfolioProject>): Promise<PortfolioProject> {
    const existingProject = this.portfolioProjects.get(id);
    
    if (!existingProject) {
      throw new Error(`Portfolio project with ID ${id} not found`);
    }
    
    const updatedProject: PortfolioProject = {
      ...existingProject,
      ...updates,
      updatedAt: new Date(),
      services: updates.services || existingProject.services,
      beforeImages: updates.beforeImages || existingProject.beforeImages,
      afterImages: updates.afterImages || existingProject.afterImages
    };
    
    this.portfolioProjects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deletePortfolioProject(id: number): Promise<void> {
    if (!this.portfolioProjects.has(id)) {
      throw new Error(`Portfolio project with ID ${id} not found`);
    }
    
    this.portfolioProjects.delete(id);
  }
  
  // Meta tags methods
  async createMetaTag(metaTag: InsertMetaTag): Promise<MetaTag> {
    const id = this.metaTagCurrentId++;
    const now = new Date();
    
    const newMetaTag: MetaTag = {
      ...metaTag,
      id,
      updatedAt: now,
      keywords: metaTag.keywords || null,
      ogTitle: metaTag.ogTitle || null,
      ogDescription: metaTag.ogDescription || null,
      ogImage: metaTag.ogImage || null,
      twitterTitle: metaTag.twitterTitle || null,
      twitterDescription: metaTag.twitterDescription || null,
      twitterImage: metaTag.twitterImage || null
    };
    
    this.metaTags.set(id, newMetaTag);
    return newMetaTag;
  }
  
  async getAllMetaTags(): Promise<MetaTag[]> {
    return Array.from(this.metaTags.values());
  }
  
  async getMetaTagByPath(pagePath: string): Promise<MetaTag | undefined> {
    return Array.from(this.metaTags.values())
      .find(tag => tag.pagePath === pagePath);
  }
  
  async updateMetaTag(id: number, updates: Partial<InsertMetaTag>): Promise<MetaTag> {
    const existingMetaTag = this.metaTags.get(id);
    
    if (!existingMetaTag) {
      throw new Error(`Meta tag with ID ${id} not found`);
    }
    
    const updatedMetaTag: MetaTag = {
      ...existingMetaTag,
      ...updates,
      updatedAt: new Date()
    };
    
    this.metaTags.set(id, updatedMetaTag);
    return updatedMetaTag;
  }
  
  async deleteMetaTag(id: number): Promise<void> {
    if (!this.metaTags.has(id)) {
      throw new Error(`Meta tag with ID ${id} not found`);
    }
    
    this.metaTags.delete(id);
  }
}

export const storage = new MemStorage();
