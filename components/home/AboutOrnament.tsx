import Image from "next/image";

type AboutOrnamentSize = "default" | "compact" | "medium";

const SIZE_CLASSES: Record<AboutOrnamentSize, string> = {
  default: "h-[7.5rem] max-w-[35.125rem]",
  compact: "h-[5.5rem] max-w-[28rem]",
  medium: "h-[6rem] max-w-[32rem]",
};

type AboutOrnamentProps = {
  className?: string;
  size?: AboutOrnamentSize;
};

export function AboutOrnament({
  className = "",
  size = "default",
}: AboutOrnamentProps) {
  return (
    <div
      className={`relative mx-auto w-full opacity-75 ${SIZE_CLASSES[size]} ${className}`.trim()}
    >
      <Image
        src="/images/divider.png"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 562px"
        className="object-contain"
      />
    </div>
  );
}
