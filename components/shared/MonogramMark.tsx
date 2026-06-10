import Image from "next/image";
import Link from "next/link";

const DROP_CAP_SRC = "/images/drop-cap-j.svg";

type MonogramMarkProps = {
  className?: string;
};

export function MonogramMark({ className = "" }: MonogramMarkProps) {
  return (
    <Link
      href="/"
      aria-label="Home"
      className={`pointer-events-auto fixed left-1/2 top-5 z-40 block -translate-x-1/2 md:top-7 ${className}`.trim()}
    >
      <Image
        src={DROP_CAP_SRC}
        alt=""
        width={48}
        height={48}
        priority
        className="h-9 w-9 object-contain object-top md:h-11 md:w-11"
      />
    </Link>
  );
}
