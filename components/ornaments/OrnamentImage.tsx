import Image, { type ImageProps } from "next/image";

function needsDirectLoad(src: string) {
  try {
    const { hostname } = new URL(src);
    // Art Institute IIIF blocks Next's image optimizer (non-browser UA → 403).
    return hostname === "www.artic.edu" || hostname === "artic.edu";
  } catch {
    return false;
  }
}

type OrnamentImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export function OrnamentImage({ src, alt, ...props }: OrnamentImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={needsDirectLoad(src)}
      {...props}
    />
  );
}
