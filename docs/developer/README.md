
# Developer Documentation

## API Endpoints

### Authentication
- `POST /api/admin/login`
  - Authenticate admin users
  - Request body: `{ username: string, password: string }`

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all submissions (admin only)
- `GET /api/contact/:id` - Get single submission (admin only)
- `PATCH /api/contact/:id/read` - Mark as read (admin only)
- `GET /api/contact/export` - Export to Excel (admin only)

### Blog Posts
- `GET /api/blog` - Get published posts
- `GET /api/admin/blog` - Get all posts (admin only)
- `GET /api/blog/category/:category` - Get by category
- `GET /api/blog/search` - Search posts
- `GET /api/blog/:id` - Get single post
- `POST /api/blog` - Create post (admin only)
- `PATCH /api/blog/:id` - Update post (admin only)
- `DELETE /api/blog/:id` - Delete post (admin only)
- `GET /api/blog/export` - Export to Excel (admin only)

### Testimonials
- `GET /api/testimonials` - Get approved testimonials
- `GET /api/admin/testimonials` - Get all testimonials (admin only)
- `GET /api/testimonials/type/:projectType` - Get by project type
- `GET /api/testimonials/:id` - Get single testimonial
- `POST /api/testimonials` - Submit testimonial
- `PATCH /api/testimonials/:id` - Update testimonial (admin only)
- `PATCH /api/testimonials/:id/approve` - Approve testimonial (admin only)
- `DELETE /api/testimonials/:id` - Delete testimonial (admin only)
- `GET /api/testimonials/export` - Export to Excel (admin only)

### Portfolio Projects
- `GET /api/portfolio` - Get all projects
- `GET /api/portfolio/featured` - Get featured projects
- `GET /api/portfolio/category/:category` - Get by category
- `GET /api/portfolio/:id` - Get single project
- `POST /api/portfolio` - Create project (admin only)
- `PATCH /api/portfolio/:id` - Update project (admin only)
- `DELETE /api/portfolio/:id` - Delete project (admin only)
- `GET /api/portfolio/export` - Export to Excel (admin only)

### Meta Tags
- `GET /api/meta-tags/:pagePath` - Get meta tags for page
- `GET /api/meta-tags` - Get all meta tags (admin only)
- `POST /api/meta-tags` - Create meta tags (admin only)
- `PATCH /api/meta-tags/:id` - Update meta tags (admin only)
- `DELETE /api/meta-tags/:id` - Delete meta tags (admin only)

## File Upload
- Uses multer middleware
- Max file size: 5MB
- Supported types: Images only
- Files stored in `/uploads` directory

## Development Notes
1. Authentication uses token-based system
2. Admin routes protected by `authMiddleware`
3. File uploads handled in `/uploads` directory
4. Excel exports saved in `/exports` directory
5. All dates stored in ISO format
6. Database schema defined in `shared/schema.ts`
7. Image processing includes automatic optimization
