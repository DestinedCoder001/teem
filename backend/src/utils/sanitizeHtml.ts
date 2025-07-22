import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const sanitizeHtml = (dirty: string) => {
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      "b", "strong", "i", "em", "u",
      "ul", "ol", "li",
      "p", "br",
      "h1", "h2", "h3"
    ],
    ALLOWED_ATTR: ["class"],
  });
};
