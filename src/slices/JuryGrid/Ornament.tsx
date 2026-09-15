// Inline version of the site's horizontal decoration (two circles joined by
// a line, see decoration_thicker-horizontal.svg in Prismic). Drawn in code so
// the stroke stays a crisp hairline (0.5px, like --border-thin) at any width
// instead of scaling with the box. Unlike the asset, the line ends at the
// circle edges instead of running to their centres, which the non-scaling
// stroke would make visible.
//
// `compact` is for small footprints such as the photo placeholder: the
// circles are larger relative to the line and the line stops at their edges,
// so it still reads as circle–line–circle at ~100px wide.
type Geometry = {
  viewBox: string;
  line: string;
  circles: { cx: number; cy: number; r: number }[];
};

const DECORATION: Geometry = {
  viewBox: '0 0 2768 242',
  line: 'M241 121H2527',
  circles: [
    { cx: 121, cy: 121, r: 120 },
    { cx: 2647, cy: 121, r: 120 },
  ],
};

const COMPACT: Geometry = {
  viewBox: '0 0 120 14',
  line: 'M13 7H107',
  circles: [
    { cx: 7, cy: 7, r: 6 },
    { cx: 113, cy: 7, r: 6 },
  ],
};

export default function Ornament({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const geometry = compact ? COMPACT : DECORATION;
  return (
    <svg
      className={className}
      viewBox={geometry.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={0.5}
      aria-hidden="true"
      focusable="false"
    >
      <path d={geometry.line} vectorEffect="non-scaling-stroke" />
      {geometry.circles.map((c) => (
        <circle
          key={c.cx}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
