import React from 'react';
import { Helmet } from 'react-helmet';

interface LocalBusinessDataProps {
  name: string;
  description: string;
  url: string;
  logoUrl: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  sameAs?: string[];
}

export const LocalBusinessData: React.FC<LocalBusinessDataProps> = ({
  name,
  description,
  url,
  logoUrl,
  telephone,
  email,
  address,
  geo,
  openingHours,
  priceRange,
  sameAs
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    url,
    logo: logoUrl,
    image: logoUrl,
    ...(telephone && { telephone }),
    ...(email && { email }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...address
      }
    }),
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude
      }
    }),
    ...(openingHours && { openingHoursSpecification: openingHours }),
    ...(priceRange && { priceRange }),
    ...(sameAs && { sameAs })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

interface BlogPostDataProps {
  title: string;
  headline: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  publisherName: string;
  publisherLogoUrl: string;
}

export const BlogPostData: React.FC<BlogPostDataProps> = ({
  title,
  headline,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  publisherName,
  publisherLogoUrl
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    headline,
    description,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogoUrl
      }
    },
    datePublished,
    dateModified
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

interface FAQDataProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQData: React.FC<FAQDataProps> = ({ faqs }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const BreadcrumbData: React.FC<BreadcrumbDataProps> = ({ items }) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default {
  LocalBusinessData,
  BlogPostData,
  FAQData,
  BreadcrumbData
};