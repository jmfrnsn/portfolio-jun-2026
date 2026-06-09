import Image from "next/image";

export function FooterSection() {
  return (
    <footer className="relative overflow-hidden pb-28 md:pb-36">
      <p
        className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 whitespace-nowrap font-display text-[clamp(6rem,28vw,27rem)] text-black/10"
        aria-hidden="true"
      >
        JadeFranson
      </p>

      <div className="relative mx-auto flex w-full max-w-[59.375rem] flex-col items-center px-6 pt-40 md:px-8 md:pt-52">
        <div className="relative aspect-[950/632] w-full max-w-[59.375rem]">
          <Image
            src="/images/footer-illustration.png"
            alt="Decorative illustration of a hand holding flowers"
            fill
            sizes="(max-width: 768px) 100vw, 950px"
            className="object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
