import React from 'react';

import { HomepageNavigationDocument } from '../../../prismicio-types';

import styles from './LandingContent.module.css';
import { PrismicNextLink } from '@prismicio/next';

type Props = { landingNavigation: HomepageNavigationDocument };

export default function LandingContent({ landingNavigation }: Props) {
  const { cta_text, the_contest, the_cadenza, the_crescendo, termine, about } =
    landingNavigation.data;
  return (
    <div className={styles.landing__container}>
      <div className={styles.landing__leftcontainer}>
        <div
          className={`${styles.landing__termine} ${styles.landing__navigationitem}`}
        >
          <PrismicNextLink field={termine}>
            <h4>{termine.text}</h4>
            <h5>{cta_text}</h5>
          </PrismicNextLink>
        </div>
      </div>
      <div className={styles.landing__rightcontainer}>
        <div className={styles.landing__rightcontainer__ccc}>
          <div
            className={`${styles.landing__contest} ${styles.landing__navigationitem}`}
          >
            <div className={styles.ccc__innercontainer}>
              <h4>{the_contest.text}</h4>
              <PrismicNextLink field={the_contest}>
                <h5>{cta_text}</h5>
              </PrismicNextLink>
            </div>
          </div>
          <div
            className={`${styles.landing__cadenza} ${styles.landing__navigationitem}`}
          >
            <div className={styles.ccc__innercontainer}>
              <h4>{the_cadenza.text}</h4>
              <PrismicNextLink field={the_cadenza}>
                <h5>{cta_text}</h5>
              </PrismicNextLink>
            </div>
          </div>
          <div
            className={`${styles.landing__crescendo} ${styles.landing__navigationitem}`}
          >
            <div className={styles.ccc__innercontainer}>
              <h4>{the_crescendo.text}</h4>
              <PrismicNextLink field={the_crescendo}>
                <h5>{cta_text}</h5>
              </PrismicNextLink>
            </div>
          </div>
        </div>
        <div
          className={`${styles.landing__about} ${styles.landing__navigationitem}`}
        >
          <PrismicNextLink field={about}>
            <h4>{about.text}</h4>
            <h5>{cta_text}</h5>
          </PrismicNextLink>
        </div>{' '}
      </div>
    </div>
  );
}
