"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  placeholderClassName?: string;
  placeholderIconClassName?: string;
  placeholderText?: string;
}

export default function BookCover({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  className,
  placeholderClassName,
  placeholderIconClassName,
  placeholderText,
}: BookCoverProps) {
  const [imgSrc, setImgSrc] = useState(src);

  function handleError() {
    if (imgSrc && imgSrc.includes("zoom=3")) {
      setImgSrc(imgSrc.replace("zoom=3", "zoom=1"));
    } else {
      setImgSrc(null);
    }
  }

  if (!imgSrc) {
    if (placeholderClassName) {
      return (
        <div className={placeholderClassName}>
          {placeholderIconClassName ? (
            <BookOpen className={placeholderIconClassName} />
          ) : placeholderText ? (
            placeholderText
          ) : null}
        </div>
      );
    }
    return null;
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      sizes={sizes}
      className={className}
      unoptimized
      onError={handleError}
    />
  );
}
