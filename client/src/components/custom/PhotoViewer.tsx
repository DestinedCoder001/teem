"use client";

import { photoViewer } from "@/lib/store/uiStore";
import { X } from "lucide-react";
import { useEffect } from "react";

const PhotoViewer = () => {
  const { isOpen, setOpen, image } = photoViewer((state) => state);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-200 w-[100dvw] h-[100dvh]"
      onClick={() => setOpen(false, "")}
    >
      <X
        onClick={() => setOpen(false, "")}
        className="absolute top-4 right-4 text-white text-3xl font-light"
      />

      <img
        src={image}
        alt="Image preview"
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default PhotoViewer;
