import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { MetaTag } from '../../../shared/schema';

interface SEOProps {
  pagePath: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
}

const SEO: React.FC<SEOProps> = ({
  pagePath,
  fallbackTitle = 'Construction Company | Quality Building Services',
  fallbackDescription = 'Professional construction services for residential and commercial projects. Quality craftsmanship and reliable service.',
  fallbackImage = '/images/default-social.jpg'
}) => {
  const { data: metaTags, isLoading, isError } = useQuery<MetaTag>({
    queryKey: ['/api/meta-tags', pagePath],
    queryFn: async () => {
      try {
        return await apiRequest(`/api/meta-tags/${encodeURIComponent(pagePath)}`);
      } catch (error) {
        // If we can't find meta tags for this page, use fallbacks
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    }
  });

  // Format the canonical URL
  const canonicalUrl = `${window.location.origin}${pagePath}`;
  
  // Use meta tags data if available, otherwise use fallbacks
  const title = metaTags?.title || fallbackTitle;
  const description = metaTags?.description || fallbackDescription;
  const ogTitle = metaTags?.ogTitle || title;
  const ogDescription = metaTags?.ogDescription || description;
  const ogImage = metaTags?.ogImage || fallbackImage;
  const twitterTitle = metaTags?.twitterTitle || ogTitle;
  const twitterDescription = metaTags?.twitterDescription || ogDescription;
  const twitterImage = metaTags?.twitterImage || ogImage;
  const keywords = metaTags?.keywords || '';
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={twitterImage.startsWith('http') ? twitterImage : `${window.location.origin}${twitterImage}`} />
    </Helmet>
  );
};

export default SEO;