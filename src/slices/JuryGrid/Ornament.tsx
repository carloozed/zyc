// Inline version of the site's horizontal decoration (two circles joined by
// a line, see decoration_thicker-horizontal.svg in Prismic). Drawn in code so
// the stroke stays a crisp 1px at any width instead of thinning with scale.
export default function Ornament({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 2768 242"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M121 121H2647" vectorEffect="non-scaling-stroke" />
      <circle cx="121" cy="121" r="120" vectorEffect="non-scaling-stroke" />
      <circle cx="2647" cy="121" r="120" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
