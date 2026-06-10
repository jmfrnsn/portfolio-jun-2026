"use client";

import { useState, type ReactNode } from "react";

type HighlightCircleCursorProps = {
  children: ReactNode;
  className?: string;
  size?: number;
};

export function HighlightCircleCursor({
  children,
  className = "",
  size = 14,
}: HighlightCircleCursorProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );

  return (
    <div
      className={`relative cursor-none [&_*]:cursor-none ${className}`.trim()}
      onMouseMove={(event) => {
        setPosition({ x: event.clientX, y: event.clientY });
      }}
      onMouseLeave={() => setPosition(null)}
    >
      {position ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 rounded-full bg-highlight-cursor"
          style={{
            width: size,
            height: size,
            left: position.x - size / 2,
            top: position.y - size / 2,
          }}
        />
      ) : null}
      {children}
    </div>
  );
}
