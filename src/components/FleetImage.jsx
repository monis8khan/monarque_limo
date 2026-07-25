"use client";

import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "/images/fleet/placeholder-vehicle.svg";

export default function FleetImage({ src, alt, className }) {
  const [imageSrc, setImageSrc] = useState(src?.trim() || FALLBACK_IMAGE);

  useEffect(() => {
    setImageSrc(src?.trim() || FALLBACK_IMAGE);
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
      }}
    />
  );
}
