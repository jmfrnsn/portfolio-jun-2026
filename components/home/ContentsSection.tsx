import Image from "next/image";

import { contents } from "./contents-data";

export function ContentsSection() {
  return (
    <section className="mx-auto flex w-full max-w-[70.25rem] flex-col items-center gap-16 px-8 pb-44 pt-8 md:px-12 md:gap-20 md:pb-52 md:pt-12">
      <div className="relative h-[7.5rem] w-full max-w-[35.125rem] opacity-75">
        <Image
          src="/images/divider.png"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 562px"
          className="object-contain"
        />
      </div>

      <div className="flex w-full flex-col items-center gap-10">
        <h2 className="font-serif text-2xl text-ink">CONTENTS</h2>

        <ol className="flex w-full flex-col gap-2">
          {contents.map((entry) => (
            <li
              key={entry.number}
              className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 p-3 sm:flex-nowrap sm:items-center ${
                entry.highlighted ? "bg-highlight" : ""
              }`}
            >
              <span className="flex min-w-0 shrink-0 items-baseline gap-2 sm:gap-3">
                <span className="font-sans text-base tracking-[-0.04375rem] text-ink sm:text-xl">
                  {entry.number}
                </span>
                <span className="font-mono text-sm font-extralight uppercase tracking-[-0.04375rem] text-ink sm:text-xl">
                  {entry.title}
                </span>
              </span>
              <span
                className="hidden min-w-8 flex-1 border-b border-dotted border-ink/35 sm:block"
                aria-hidden="true"
              />
              <span className="font-mono text-sm font-extralight tracking-[-0.04375rem] text-ink sm:ml-auto sm:text-xl">
                {entry.pages}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
