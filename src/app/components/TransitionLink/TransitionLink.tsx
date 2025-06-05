'use client';

import React, { useRef } from 'react';

import { asLink, LinkField, PrismicDocument } from '@prismicio/client';
import { Link } from 'next-view-transitions';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

gsap.registerPlugin(useGSAP);

export type TransitionLinkProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
  hasText?: boolean;
  hasAnimation?: boolean;
  isDisabled?: boolean;
} & (
  | { field: LinkField | null; document?: never; href?: never }
  | { field?: never; document: PrismicDocument | null; href?: never }
  | { field?: never; document?: never; href: string }
);

export function TransitionLink({
  field,
  document: doc,
  href,
  children,
  className,
  onClick,
  tabIndex,
  hasText = true,
  isDisabled = false,
}: TransitionLinkProps) {
  const url = href ?? asLink(field ?? doc);
  const linkRef = useRef<HTMLAnchorElement>(null);

  if (!url) {
    console.warn('TransitionLink: No valid URL provided');
    return null;
  }

  return (
    <Link
      ref={linkRef}
      href={isDisabled ? '' : url}
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      style={{
        visibility: isDisabled ? 'hidden' : 'visible',
      }}
    >
      {hasText ? (field?.text ?? children) : children}
    </Link>
  );
}
