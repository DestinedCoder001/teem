import { photoViewer } from "@/lib/store/uiStore";
import { X } from "lucide-react";
import { useEffect } from "react";

const PhotoViewer = () => {
  const { isOpen, setOpen, image } = photoViewer((state) => state);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false, "");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, setOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-200 w-[100dvw] h-[100dvh]"
      onClick={() => setOpen(false, "")}
    >
      <div
        className="p-1 absolute top-4 right-4 text-white text-3xl font-light hover:bg-neutral-600 dark:hover:bg-neutral-700 cursor-pointer rounded-full"
        onClick={() => setOpen(false, "")}
      >
        <X size={20} strokeWidth={1.5} className="" />
      </div>

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
