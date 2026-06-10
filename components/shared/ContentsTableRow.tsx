type ContentsTableRowProps = {
  number?: string;
  title: string;
  suffix: string;
  suffixClassName?: string;
};

export function ContentsTableRow({
  number,
  title,
  suffix,
  suffixClassName = "font-mono font-extralight tracking-[-0.04375rem] text-ink",
}: ContentsTableRowProps) {
  return (
    <>
      {number ? (
        <span className="shrink-0 font-sans tracking-[-0.04375rem] text-ink">
          {number}
        </span>
      ) : null}
      <span className="min-w-0 shrink font-mono font-extralight uppercase tracking-[-0.04375rem] text-ink">
        {title}
      </span>
      <span
        className="min-w-8 flex-1 border-b border-dotted border-ink/35"
        aria-hidden="true"
      />
      <span className={`shrink-0 ${suffixClassName}`.trim()}>{suffix}</span>
    </>
  );
}
