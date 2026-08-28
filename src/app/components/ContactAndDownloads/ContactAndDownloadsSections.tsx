'use client';

import React, { useRef } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';
import type { LinkField, RichTextField } from '@prismicio/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import {
  AnmeldelinkDocument,
  ContactAndDownloadsDocument,
} from '@/prismicio-types';
import { RevealText } from '@/app/components/RevealText/RevealText';
import NewsletterLink from '@/app/components/NewsletterLink/NewsletterLink';
import ContactLink from '@/app/components/ContactLink/ContactLink';
import { useMobile } from '@/contexts/MobileContext';
import { siteEase } from '@/helpers/siteEase';

import styles from './ContactAndDownloadsSections.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ContactAndDownloadsSection = 'contact' | 'newsletter' | 'downloads';

type LinkAction = 'link' | 'open_contact_form' | 'open_newsletter_form';
type LinkItem = { link: LinkField; action?: LinkAction | null };

type Props = {
  doc: ContactAndDownloadsDocument;
  /** Which blocks of the document to render, in order. */
  sections: ContactAndDownloadsSection[];
  /** When given, the mobile "Anmelden" button shows inside its date window. */
  signuplink?: AnmeldelinkDocument;
} & React.HTMLAttributes<HTMLElement>;

const linkText = (link: LinkField) =>
  'text' in link && typeof link.text === 'string' ? link.text : undefined;

function ActionLink({ item }: { item: LinkItem }) {
  switch (item.action) {
    case 'open_contact_form':
      return (
        <ContactLink
          hasUnderscore={true}
          hasBorder={false}
          buttonText={linkText(item.link)}
        />
      );
    case 'open_newsletter_form':
      return (
        <NewsletterLink
          hasUnderscore={true}
          hasBorder={false}
          label={linkText(item.link)}
        />
      );
    default:
      return <PrismicNextLink field={item.link} target="_blank" />;
  }
}

function Block({
  title,
  text,
  links,
  arrowClassName,
}: {
  title: RichTextField;
  text: RichTextField;
  links: LinkItem[];
  arrowClassName?: string;
}) {
  return (
    <div className={`cd-section ${styles.sectioncontainer}`}>
      <RevealText field={title} useScrollTrigger={true} as={'h2'} />
      <div className="cd-fade">
        <PrismicRichText field={text} />
      </div>
      <div className={styles.linkscontainer}>
        {links.map((item, index) => (
          <div
            key={`${index}-${linkText(item.link) ?? ''}`}
            className={`cd-fade ${styles.downloadlink}`}
          >
            <ActionLink item={item} />
            <p aria-hidden="true" className={arrowClassName}>
              &darr;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** True while today is inside the sign-up button's show/hide window. */
function isWithinSignupWindow(signuplink: AnmeldelinkDocument) {
  const today = new Date().toISOString().split('T')[0];
  const show = signuplink.data.show_button_date?.split('T')[0];
  const hide = signuplink.data.hide_button_date?.split('T')[0];
  if (!show) return false;
  return today >= show && (!hide || today < hide);
}

/**
 * Renders any combination of the shared "Contact & Downloads" document's
 * blocks. Used by the ContactAndDownload slice, and reusable anywhere a
 * single block (e.g. just the newsletter) is needed.
 */
export default function ContactAndDownloadsSections({
  doc,
  sections,
  signuplink,
  className,
  ...rest
}: Props) {
  const { isMobile, isTabletPortrait } = useMobile();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Each block fades its text and links in on its own trigger,
      // links cascading after the text.
      gsap.utils
        .toArray<HTMLElement>('.cd-section', sectionRef.current)
        .forEach((group) => {
          gsap.from(group.querySelectorAll('.cd-fade'), {
            autoAlpha: 0,
            y: 24,
            duration: 1.2,
            ease: siteEase,
            stagger: 0.12,
            scrollTrigger: { trigger: group, start: 'top 75%' },
          });
        });
    },
    { scope: sectionRef },
  );

  const d = doc.data;
  const blocks: Record<ContactAndDownloadsSection, React.ReactNode> = {
    contact: (
      <Block
        key="contact"
        title={d.contact_title}
        text={d.contact_text}
        links={d.contact_links}
        arrowClassName={styles.rotatedarrow}
      />
    ),
    newsletter: (
      <Block
        key="newsletter"
        title={d.newsletter_title}
        text={d.newsletter_text}
        links={d.newsletter_links}
        arrowClassName={styles.rotatedarrow}
      />
    ),
    downloads: (
      <Block
        key="downloads"
        title={d.downloads_title}
        text={d.downloads_text}
        links={d.download_links}
      />
    ),
  };

  const showSignup =
    signuplink &&
    isWithinSignupWindow(signuplink) &&
    (isMobile || isTabletPortrait);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${className ?? ''}`}
      {...rest}
    >
      {sections.map((section) => blocks[section])}
      {showSignup && (
        <div className={styles.signuplink}>
          <PrismicNextLink field={signuplink.data.anmeldelink}>
            Anmelden
          </PrismicNextLink>
        </div>
      )}
    </section>
  );
}
