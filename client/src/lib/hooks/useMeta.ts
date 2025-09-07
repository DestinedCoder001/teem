import { useHead } from '@unhead/react';

type Meta = {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
}

export const useMeta = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage
}: Meta) => {
  const metaTags = [];

  if (description) {
    metaTags.push({ name: 'description', content: description });
  }
  
  if (ogTitle || title) {
    metaTags.push({ property: 'og:title', content: ogTitle || title });
  }
  
  if (ogDescription || description) {
    metaTags.push({ property: 'og:description', content: ogDescription || description });
  }
  
  if (ogImage) {
    metaTags.push({ property: 'og:image', content: ogImage });
  }

  metaTags.push({ property: 'og:type', content: 'website' });
  metaTags.push({ name: 'twitter:card', content: 'summary_large_image' });
  
  if (ogTitle || title) {
    metaTags.push({ name: 'twitter:title', content: ogTitle || title });
  }
  
  if (ogDescription || description) {
    metaTags.push({ name: 'twitter:description', content: ogDescription || description });
  }
  
  if (ogImage) {
    metaTags.push({ name: 'twitter:image', content: ogImage });
  }

  useHead({
    title,
    meta: metaTags
  });
};