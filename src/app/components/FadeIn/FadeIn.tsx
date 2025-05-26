'use client';

import React, { useRef } from 'react';

import gsap from 'gsap';

import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

type FadeInProps = {
  children?: React.ReactNode;
  vars?: gsap.TweenVars;
  className?: string;
};

export default function FadeIn({
  children,
  vars = {},
  className,
}: FadeInProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.to(containerRef.current, {
        scale: 1,
        opacity: 1,
        duration: 5,
        ease: 'power3.out',
        delay: 0.5,
        y: 0,
        ...vars,
      });
    },
    { scope: containerRef }
  );

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
}
