import { useHead } from "@unhead/react";

type Meta = {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};

export const useMeta = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
}: Meta) => {
  const metaTags = [];
  const defaultOgImage =
    "https://res.cloudinary.com/dddzjiuet/image/upload/v1757509560/general/gfxkyhii2wupy7qjbivo.jpg";

  // Basic meta tags
  if (description) {
    metaTags.push({ name: "description", content: description });
  }

  // Keywords for SEO
  metaTags.push({
    name: "keywords",
    content:
      "Teem, Teem app, collaboration, remote, teams, team, real-time, communication",
  });

  // Robots meta
  metaTags.push({ name: "robots", content: "index, follow" });

  // Open Graph tags (Facebook, LinkedIn, WhatsApp, Telegram)
  metaTags.push({ property: "og:type", content: "website" });
  metaTags.push({ property: "og:site_name", content: "Teem" });

  if (ogTitle || title) {
    metaTags.push({ property: "og:title", content: ogTitle || title });
  }

  if (ogDescription || description) {
    metaTags.push({
      property: "og:description",
      content: ogDescription || description,
    });
  }

  // Always include an image (provided or default)
  const imageUrl = ogImage || defaultOgImage;
  metaTags.push({ property: "og:image", content: imageUrl });
  metaTags.push({ property: "og:image:type", content: "image/jpeg" });
  metaTags.push({ property: "og:image:width", content: "1200" });
  metaTags.push({ property: "og:image:height", content: "630" });
  metaTags.push({
    property: "og:image:alt",
    content: `${ogTitle || title || "Teem"} - Team collaboration platform`,
  });

  // Twitter/X Card tags
  metaTags.push({ name: "twitter:card", content: "summary_large_image" });

  if (ogTitle || title) {
    metaTags.push({ name: "twitter:title", content: ogTitle || title });
  }

  if (ogDescription || description) {
    metaTags.push({
      name: "twitter:description",
      content: ogDescription || description,
    });
  }

  // Twitter image (always include)
  metaTags.push({ name: "twitter:image", content: imageUrl });
  metaTags.push({
    name: "twitter:image:alt",
    content: `${ogTitle || title || "Teem"} - Team collaboration platform`,
  });

  // LinkedIn specific enhancements
  if (ogTitle || title) {
    metaTags.push({ property: "article:author", content: "Teem" });
  }

  // Mobile and WhatsApp optimizations
  metaTags.push({ name: "format-detection", content: "telephone=no" });
  metaTags.push({ name: "mobile-web-app-capable", content: "yes" });

  useHead({
    title,
    meta: metaTags,
  });
};
