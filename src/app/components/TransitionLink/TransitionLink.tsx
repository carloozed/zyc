'use client';

import React, { useRef } from 'react';

import { asLink, LinkField, PrismicDocument } from '@prismicio/client';
import Link from 'next/link';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import { useRouter } from 'next/navigation';

gsap.registerPlugin(useGSAP);

export type TransitionLinkProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
  hasText?: boolean;
  hasAnimation?: boolean;
} & (
  | { field: LinkField | null; document?: never; href?: never }
  | { field?: never; document: PrismicDocument | null; href?: never }
  | { field?: never; document?: never; href: string }
);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function TransitionLink({
  field,
  document: doc,
  href,
  children,
  className,
  tabIndex,
  hasText = true,
}: TransitionLinkProps) {
  const url = href ?? asLink(field ?? doc);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const router = useRouter();

  const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetUrl = href ?? url;

    // TODO: Run some exit animation here

    const body = document.querySelector('.transition-container');
    body?.classList.add('page-transition');

    // sleep for some time

    await sleep(2500); // Adjust the duration as needed
    if (typeof targetUrl === 'string') {
      router.push(targetUrl);

      await sleep(500); // Adjust the duration as needed
      // TODO: Run some enter animation

      body?.classList.remove('page-transition');
    }
  };

  if (!url) {
    console.warn('TransitionLink: No valid URL provided');
    return null;
  }

  return (
    <Link
      ref={linkRef}
      href={url}
      className={className}
      onClick={handleTransition}
      tabIndex={tabIndex}
    >
      {hasText ? (field?.text ?? children) : children}
    </Link>
  );
}
