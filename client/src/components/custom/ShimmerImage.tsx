import { photoViewer } from "@/lib/store/uiStore";
import { useState } from "react";

type ShimmerImageProps = {
  src: string;
  alt?: string;
  className?: string;
};

const ShimmerImage = ({ src, alt, className }: ShimmerImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const { setOpen } = photoViewer((state) => state);

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      {!loaded && <div className="absolute inset-0 shimmer"></div>}

      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
          loaded ? "opacity-100 cursor-pointer" : "opacity-0"
        }`}
        onClick={() => {
          if (loaded) setOpen(true, src);
        }}
      />
    </div>
  );
};

export default ShimmerImage;