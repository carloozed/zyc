'use client';

import React, { useState } from 'react';
import {
  HomepageNavigationDocument,
  LandingBackgroundImageDocument,
  DynamiclandingcontentDocument,
  TermineIsVisibleDocument,
} from '@/prismicio-types';
import styles from './LandingContent.module.css';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { useMobile } from '@/contexts/MobileContext';
import { RevealText } from '@/app/components/RevealText/RevealText';
import FadeIn from '../FadeIn/FadeIn';
import { TransitionLink } from '../TransitionLink/TransitionLink';
import { KeyTextField, RichTextField, LinkField } from '@prismicio/client';

type Props = {
  landingNavigation: HomepageNavigationDocument;
  hoverElements: DynamiclandingcontentDocument[];
  background: LandingBackgroundImageDocument;
  termineIsVisible: TermineIsVisibleDocument;
};

type NavigationItemProps = {
  isMobile: boolean;
  isTabletPortrait?: boolean;
  linkField: LinkField;
  titleField: RichTextField;
  id: string;
  delay?: number;
  onHover?: () => void;
  className?: string;
  ctaText: KeyTextField;
  style?: React.CSSProperties;
};

const NavigationItem = ({
  isMobile,
  linkField,
  isTabletPortrait,
  titleField,
  id,
  delay = 0,
  onHover,
  className = '',
  ctaText,
  style,
}: NavigationItemProps) => {
  const content = (
    <div
      className={`${className} ${styles.landing__navigationitem}`}
      onMouseEnter={onHover}
      style={style}
    >
      <div className={styles.ccc__innercontainer}>
        <RevealText
          field={titleField}
          id={id}
          staggerAmount={0.2}
          duration={1.4}
          as={'h4'}
          delay={delay}
        />
        {!isMobile && (
          <TransitionLink field={linkField}>
            <h5>{ctaText}</h5>
          </TransitionLink>
        )}
      </div>
    </div>
  );

  return isMobile || isTabletPortrait ? (
    <TransitionLink field={linkField}>{content}</TransitionLink>
  ) : (
    content
  );
};

export default function LandingContent({
  landingNavigation,
  hoverElements,
  background,
}: Props) {
  const [hoveredElement, setHoveredElement] = useState('');
  const { isMobile, isTabletPortrait } = useMobile();

  const isHovered = hoveredElement !== '';

  const clearHover = () => setHoveredElement('');

  const {
    cta_text,
    the_contest,
    the_cadenza,
    the_crescendo,
    about,
    magazin,
    the_contest_title,
    the_cadenza_title,
    the_crescendo_title,
    about_title,
    magazin_title,
  } = landingNavigation.data;

  const contestHover = hoverElements.find(
    (element) => element.uid === 'landinghover-contest',
  );
  const cadenzaHover = hoverElements.find(
    (element) => element.uid === 'cadenza',
  );
  const crescendoHover = hoverElements.find(
    (element) => element.uid === 'crescendo',
  );
  const aboutHover = hoverElements.find((element) => element.uid === 'about');
  const magazinHover = hoverElements.find(
    (element) => element.uid === 'magazin',
  );

  const activeHover = {
    contest: contestHover,
    cadenza: cadenzaHover,
    crescendo: crescendoHover,
    about: aboutHover,
    magazin: magazinHover,
  }[hoveredElement];

  return (
    <div className={styles.landing__container}>
      <div className={styles.heroimage__container}>
        <FadeIn
          vars={{
            scale: 1,
            opacity: 1,
            duration: 6,
            filter: 'blur(0px)',
          }}
          className="heroimage__animation"
        >
          <PrismicNextImage
            field={background.data.image}
            priority
            className={styles.heroimage}
          />
        </FadeIn>
      </div>
      <div
        className={styles.landing__leftcontainer}
        onMouseLeave={clearHover}
      >
        <div className={styles.landing__leftcontainer__content}>
          {!isMobile && (
            <div
              className={styles.leftcontainer__dynamic}
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <div className={styles.decor}>
                <div className={styles.circle}></div>
                <div className={styles.line}></div>
                <div className={styles.circle}></div>
              </div>
              <div>
                {activeHover && (
                  <>
                    <PrismicRichText field={activeHover.data.title} />
                    <PrismicRichText field={activeHover.data.description} />
                  </>
                )}
              </div>
              <div className={styles.decor}>
                <div className={styles.circle}></div>
                <div className={styles.line}></div>
                <div className={styles.circle}></div>
              </div>
            </div>
          )}
          <NavigationItem
            isMobile={isMobile}
            isTabletPortrait={isTabletPortrait}
            linkField={magazin}
            titleField={magazin_title}
            id="magazin-hero"
            delay={0.7}
            className={styles.landing__magazin}
            ctaText={cta_text}
            onHover={() => setHoveredElement('magazin')}
          />
        </div>
      </div>
      <div
        className={styles.landing__rightcontainer}
        onMouseLeave={clearHover}
      >
        <div className={styles.landing__rightcontainer__ccc}>
          <NavigationItem
            isMobile={isMobile}
            isTabletPortrait={isTabletPortrait}
            linkField={the_contest}
            titleField={the_contest_title}
            id="the_contest-hero"
            onHover={() => setHoveredElement('contest')}
            ctaText={cta_text}
            className={styles.landing__contest}
          />
          <NavigationItem
            isMobile={isMobile}
            isTabletPortrait={isTabletPortrait}
            linkField={the_cadenza}
            titleField={the_cadenza_title}
            id="the_cadenza-hero"
            delay={0.2}
            onHover={() => setHoveredElement('cadenza')}
            ctaText={cta_text}
            className={styles.landing__cadenza}
          />
          <NavigationItem
            isMobile={isMobile}
            isTabletPortrait={isTabletPortrait}
            linkField={the_crescendo}
            titleField={the_crescendo_title}
            id="the_crescendo-hero"
            delay={0.4}
            onHover={() => setHoveredElement('crescendo')}
            ctaText={cta_text}
            className={styles.landing__crescendo}
          />
        </div>
        <NavigationItem
          isMobile={isMobile}
          isTabletPortrait={isTabletPortrait}
          linkField={about}
          titleField={about_title}
          id="about-hero"
          delay={0.5}
          onHover={() => setHoveredElement('about')}
          ctaText={cta_text}
          className={styles.landing__about}
        />
      </div>
    </div>
  );
}
