'use client';

import React from 'react';

import { asLink, LinkField, PrismicDocument } from '@prismicio/client';
import { Link } from 'next-view-transitions';

export type TransitionLinkProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
  hasText?: boolean;
  isDisabled?: boolean;
} & (
  | { field: LinkField | null; document?: never; href?: never }
  | { field?: never; document: PrismicDocument | null; href?: never }
  | { field?: never; document?: never; href: string }
);

// Strip locale prefix from URLs for consistent display
function stripLocalePrefix(url: string) {
  // Remove locale prefix like /de-ch/, /en-us/, etc.
  return url.replace(/^\/[a-z]{2}-[a-z]{2}(\/|$)/, '/');
}

function getLinkUrl({
  field,
  document: doc,
  href,
}: Pick<TransitionLinkProps, 'field' | 'document' | 'href'>) {
  const rawUrl = href ?? asLink(field ?? doc);

  return rawUrl ? stripLocalePrefix(rawUrl) : null;
}

function getLinkContent({
  field,
  children,
  hasText,
}: Pick<TransitionLinkProps, 'field' | 'children' | 'hasText'>) {
  return hasText ? (field?.text ?? children) : children;
}

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
  const url = getLinkUrl({ field, document: doc, href });

  if (!url) {
    console.warn('TransitionLink: No valid URL provided');
    return null;
  }

  return (
    <Link
      href={isDisabled ? '' : url}
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
      style={{
        visibility: isDisabled ? 'hidden' : 'visible',
      }}
    >
      {getLinkContent({ field, children, hasText })}
    </Link>
  );
}
