'use client';

import React, { useState } from 'react';

import { HomepageNavigationDocument } from '../../../../prismicio-types';
import { DynamiclandingcontentDocument } from '../../../../prismicio-types';
import styles from './LandingContent.module.css';
import { PrismicNextLink } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';

import { useRevealer } from '@/hooks/useRevealer';

import { RevealText } from '@/app/components/RevealText/RevealText';

type Props = {
  landingNavigation: HomepageNavigationDocument;
  hoverElements: DynamiclandingcontentDocument[];
};

export default function LandingContent({
  landingNavigation,
  hoverElements,
}: Props) {
  const [hoveredElement, setHoveredElement] = useState('');
  // const [isHovered, setIsHovered] = useState(false);

  const {
    cta_text,
    the_contest,
    the_cadenza,
    the_crescendo,
    termine,
    about,
    the_contest_title,
    the_cadenza_title,
    the_crescendo_title,
    termine_title,
    about_title,
  } = landingNavigation.data;

  const [contestHover, cadenzaHover, crescendoHover] = hoverElements;
  useRevealer();

  return (
    <div className={styles.landing__container}>
      <div className={styles.landing__leftcontainer}>
        <div className={styles.landing__leftcontainer__content}>
          <div
            className={styles.leftcontainer__dynamic}
            style={{ opacity: hoveredElement !== '' ? 1 : 0 }}
          >
            <div className={styles.decor}>
              <div className={styles.circle}></div>
              <div className={styles.line}></div>
              <div className={styles.circle}></div>
            </div>
            <div>
              {hoveredElement === 'contest' ? (
                <>
                  <PrismicRichText field={contestHover.data.title} />
                  <PrismicRichText field={contestHover.data.description} />
                </>
              ) : hoveredElement === 'cadenza' ? (
                <>
                  <PrismicRichText field={crescendoHover.data.title} />
                  <PrismicRichText field={crescendoHover.data.description} />
                </>
              ) : hoveredElement === 'crescendo' ? (
                <>
                  <PrismicRichText field={cadenzaHover.data.title} />
                  <PrismicRichText field={cadenzaHover.data.description} />
                </>
              ) : null}
            </div>
            <div className={styles.decor}>
              <div className={styles.circle}></div>
              <div className={styles.line}></div>
              <div className={styles.circle}></div>
            </div>
          </div>

          <div
            className={`${styles.landing__termine} ${styles.landing__navigationitem}`}
          >
            <RevealText
              field={termine_title}
              id="termine-hero"
              staggerAmount={0.3}
              duration={1}
              as={'h4'}
              delay={0.7}
            />
            <PrismicNextLink field={termine}>
              <h5>{cta_text}</h5>
            </PrismicNextLink>
          </div>
        </div>
      </div>
      <div className={styles.landing__rightcontainer}>
        <div className={styles.landing__rightcontainer__ccc}>
          <div
            onMouseOver={() => setHoveredElement('contest')}
            onMouseLeave={() => setHoveredElement('')}
            className={`${styles.landing__contest} ${styles.landing__navigationitem}`}
          >
            <div className={styles.ccc__innercontainer}>
              <RevealText
                field={the_contest_title}
                id="the_contest-hero"
                staggerAmount={0.2}
                duration={1.4}
                as={'h4'}
              />
              <PrismicNextLink field={the_contest}>
                <h5>{cta_text}</h5>
              </PrismicNextLink>
            </div>
          </div>
          <div
            className={`${styles.landing__cadenza} ${styles.landing__navigationitem}`}
            onMouseOver={() => setHoveredElement('cadenza')}
            onMouseLeave={() => setHoveredElement('')}
          >
            <div className={styles.ccc__innercontainer}>
              <RevealText
                field={the_cadenza_title}
                id="the_cadenza-hero"
                staggerAmount={0.2}
                duration={1.4}
                as={'h4'}
                delay={0.2}
              />
              <PrismicNextLink field={the_cadenza}>
                <h5>{cta_text}</h5>
              </PrismicNextLink>
            </div>
          </div>
          <div
            onMouseOver={() => setHoveredElement('crescendo')}
            onMouseLeave={() => setHoveredElement('')}
            className={`${styles.landing__crescendo} ${styles.landing__navigationitem}`}
          >
            <div className={styles.ccc__innercontainer}>
              <RevealText
                field={the_crescendo_title}
                id="the_crescendo-hero"
                staggerAmount={0.2}
                duration={1.4}
                as={'h4'}
                delay={0.4}
              />
              <PrismicNextLink field={the_crescendo}>
                <h5>{cta_text}</h5>
              </PrismicNextLink>
            </div>
          </div>
        </div>
        <div
          className={`${styles.landing__about} ${styles.landing__navigationitem}`}
        >
          {' '}
          <RevealText
            field={about_title}
            id="about-hero"
            staggerAmount={0.3}
            duration={1}
            as={'h4'}
            delay={0.5}
          />
          <PrismicNextLink field={about}>
            <h5>{cta_text}</h5>
          </PrismicNextLink>
        </div>{' '}
      </div>
    </div>
  );
}
