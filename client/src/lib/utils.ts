import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "dompurify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sanitizeHTML = (dirty: string) =>
  DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      "b", "strong", "i", "em", "u",
      "ul", "ol", "li",
      "p", "br",
      "h1", "h2", "h3",
    ],
    ALLOWED_ATTR: ["class"],
  });

