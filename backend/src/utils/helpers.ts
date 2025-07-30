export const getCloudinaryResourceType = (base64: string): "image" | "raw" => {
  const match = base64.match(/^data:(.*?);base64,/);
  const mime = match?.[1] || "";
  return mime.startsWith("image/") ? "image" : "raw";
};

export const isValidFile = (base64: string): boolean => {
  const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);
  const match = base64.match(/^data:(.*?);base64,/);
  const mime = match ? match[1].trim().toLowerCase() : null;
  if (!mime) return false;
  return allowedMimeTypes.has(mime);
};
