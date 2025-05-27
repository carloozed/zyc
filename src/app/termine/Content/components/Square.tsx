import React, { useRef } from 'react';

import gsap from 'gsap';

import { useGSAP } from '@gsap/react';

import DrawSVGPlugin from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin, useGSAP);

type SquareProps = {
  delay?: number;
  ease?: string;
  duration?: number;
};

const Square = ({
  delay = 2,
  ease = 'power1.inOut',
  duration = 2,
}: SquareProps) => {
  const pathRef = useRef<SVGRectElement>(null);
  const secondPathRef = useRef<SVGRectElement>(null);

  useGSAP(() => {
    const path = pathRef.current;
    const secondPath = secondPathRef.current;
    if (path && secondPath) {
      gsap.fromTo(
        path,
        { drawSVG: '0%' },
        { drawSVG: '100%', duration: duration, ease: ease, delay: delay }
      );
      gsap.fromTo(
        secondPath,
        { drawSVG: '0%' },
        { drawSVG: '100%', duration: duration, ease: ease, delay: delay + 0.6 }
      );
    }
  });

  return (
    <svg
      width={146}
      height={146}
      viewBox="0 0 146 146"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x={0.25}
        y={0.25}
        width={145.5}
        height={145.5}
        rx={19.75}
        stroke="black"
        strokeWidth={0.5}
        ref={pathRef}
      />
      <rect
        x={10.25}
        y={10.25}
        width={15.5}
        height={15.5}
        rx={7.75}
        stroke="black"
        strokeWidth={0.5}
        ref={secondPathRef}
      />
    </svg>
  );
};

export default Square;
