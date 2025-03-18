import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/data";

const BlogSection = () => {
  const displayPosts = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="font-montserrat font-bold text-3xl md:text-4xl text-[#0f172a] mb-4"
          >
            Latest From Our Blog
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-[#64748b] max-w-3xl mx-auto"
          >
            Stay updated with industry trends, construction tips, and company news.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-[#64748b] mb-3">
                  <i className="far fa-calendar-alt mr-2"></i>
                  <span>{post.date}</span>
                  <i className="far fa-user ml-4 mr-2"></i>
                  <span>{post.author}</span>
                </div>
                <h3 className="font-montserrat font-semibold text-xl text-[#0f172a] mb-3">
                  {post.title}
                </h3>
                <p className="text-[#64748b] mb-4">{post.excerpt}</p>
                <Link href="/blog" className="inline-block text-[#f97316] font-medium hover:underline">
                  Read More <i className="fas fa-arrow-right ml-1"></i>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/blog">
            <Button className="bg-[#f97316] hover:bg-[#f97316]/90 text-white">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
