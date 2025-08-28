import { useState } from "react";

type ShimmerImageProps = {
  src: string;
  alt?: string;
  className?: string;
};

const ShimmerImage = ({ src, alt, className }: ShimmerImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      {!loaded && <div className="absolute inset-0 shimmer"></div>}

      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default ShimmerImage;