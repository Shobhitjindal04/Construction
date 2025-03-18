import React from 'react';
import SEO from '@/components/common/SEO';
import { LocalBusinessData } from '@/components/common/StructuredData';

interface SEOLayoutProps {
  children: React.ReactNode;
  pagePath: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

const companyData = {
  name: 'Premium Construction Company',
  description: 'Expert construction services for residential and commercial projects. Quality craftsmanship and reliable service.',
  url: 'https://premiumconstruction.com',
  logoUrl: 'https://premiumconstruction.com/logo.png',
  telephone: '+1-555-123-4567',
  email: 'info@premiumconstruction.com',
  address: {
    streetAddress: '123 Builder St',
    addressLocality: 'Construction City',
    addressRegion: 'CA',
    postalCode: '90210',
    addressCountry: 'US'
  },
  priceRange: '$$$',
  sameAs: [
    'https://facebook.com/premiumconstruction',
    'https://twitter.com/premiumconstruct',
    'https://instagram.com/premiumconstruction',
    'https://linkedin.com/company/premium-construction'
  ]
};

const SEOLayout: React.FC<SEOLayoutProps> = ({
  children,
  pagePath,
  title,
  description,
  imageUrl
}) => {
  return (
    <>
      <SEO 
        pagePath={pagePath}
        fallbackTitle={title}
        fallbackDescription={description}
        fallbackImage={imageUrl}
      />
      <LocalBusinessData 
        name={companyData.name}
        description={companyData.description}
        url={companyData.url}
        logoUrl={companyData.logoUrl}
        telephone={companyData.telephone}
        email={companyData.email}
        address={companyData.address}
        priceRange={companyData.priceRange}
        sameAs={companyData.sameAs}
      />
      {children}
    </>
  );
};

export default SEOLayout;