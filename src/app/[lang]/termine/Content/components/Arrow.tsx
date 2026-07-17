import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin, useGSAP);

type ArrowProps = {
  direction: 'up' | 'down';
  delay?: number;
  ease?: string;
  duration?: number;
};

const ARROW_PATHS: Record<ArrowProps['direction'], string> = {
  up: 'M90 1.00003L89.2042 3.77493L87.199 1.69832L90 1.00003ZM1 1.00003L1.17678 0.823254C26.0135 25.6599 64.1833 24.7823 88.2145 2.37668L88.385 2.55954L88.5555 2.74239C64.3355 25.324 25.8583 26.2118 0.823224 1.17681L1 1.00003Z',
  down: 'M90 19.5667L89.2042 16.7918L87.199 18.8685L90 19.5667ZM1 19.5667L1.17678 19.7435C26.0135 -5.09313 64.1833 -4.21556 88.2145 18.1901L88.385 18.0072L88.5555 17.8244C64.3355 -4.75724 25.8583 -5.64501 0.823224 19.39L1 19.5667Z',
};

const Arrow = ({
  direction,
  delay = 2,
  ease = 'power1.inOut',
  duration = 2,
}: ArrowProps) => {
  const pathRef = useRef<SVGPathElement>(null); // ✅ Correct type

  useGSAP(() => {
    const path = pathRef.current;
    if (path) {
      gsap.fromTo(
        path,
        { drawSVG: '0%' },
        { drawSVG: '48%', duration, ease, delay }
      );
    }
  }, []);

  return (
    <svg
      width={90}
      height={20}
      viewBox="0 0 90 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={ARROW_PATHS[direction]}
        stroke="black"
        strokeWidth="0.5"
        fill="none"
        ref={pathRef}
      />
    </svg>
  );
};

export default Arrow;
