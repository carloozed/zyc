'use client';

import React, { useMemo, useRef, useState } from 'react';
import { asText, isFilled } from '@prismicio/client';
import {
  JuryGridSlice,
  JuryGridSliceBaseGridPrimaryPastMembersItem,
} from '@/prismicio-types';

import styles from './JuryContent.module.css';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { RevealText } from '@/app/components/RevealText/RevealText';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { siteEase } from '@/helpers/siteEase';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = { slice: JuryGridSlice };

export default function JuryContent({ slice }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [pastOpen, setPastOpen] = useState(false);

  // Rows are entered flat in Prismic; the year number on each row decides
  // which season it belongs to. Members serving several seasons get one row
  // per year. Missing years sink to the bottom instead of disappearing.
  const pastByYear = useMemo(() => {
    const rows = (slice.primary.past_members ?? []).filter(
      (row: JuryGridSliceBaseGridPrimaryPastMembersItem) =>
        isFilled.keyText(row.name),
    );
    const byYear = new Map<
      number,
      JuryGridSliceBaseGridPrimaryPastMembersItem[]
    >();
    rows.forEach((row) => {
      const year = row.year ?? 0;
      byYear.set(year, [...(byYear.get(year) ?? []), row]);
    });
    return [...byYear.entries()].sort(([a], [b]) => b - a);
  }, [slice.primary.past_members]);

  useGSAP(
    () => {
      // Intro text and each member card fade up as they scroll into view.
      gsap.utils
        .toArray<HTMLElement>('.jury-fade', sectionRef.current)
        .forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 24,
            duration: 1.2,
            ease: siteEase,
            scrollTrigger: { trigger: el, start: 'top 80%' },
          });
        });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={styles.jury__sectioncontainer}
      id="jury"
    >
      <RevealText
        field={slice.primary.headline}
        useScrollTrigger={true}
        as={'h2'}
      />
      <div className={`jury-fade ${styles.jury__introduction}`}>
        <PrismicRichText field={slice.primary.introduction} />
      </div>
      <div className={styles.jury__members}>
        {slice.primary.members.map((item, index) => (
          <div key={index} className={`jury-fade ${styles.jury__member}`}>
            <div>
              <div className={styles.jury__container}>
                <div className={styles.jury__uppercontainer}>
                  <PrismicNextImage field={item.photo} />
                  <PrismicRichText field={item.bio} />
                </div>
                <div className={styles.jury__lowercontainer}>
                  <PrismicRichText field={item.name} />
                  <PrismicNextLink
                    field={item.jurymember_link}
                    aria-label={`${slice.primary.link_text} – ${asText(item.name)}`}
                  >
                    {slice.primary.link_text}
                  </PrismicNextLink>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isFilled.keyText(slice.primary.past_title) && pastByYear.length > 0 && (
        <div className={`jury-fade ${styles.jury__past}`}>
          <button
            type="button"
            className={styles.jury__past_toggle}
            onClick={() => setPastOpen(!pastOpen)}
            aria-expanded={pastOpen}
            aria-controls="jury-past-content"
          >
            <div className={styles.jury__past_title}>
              <h3>{slice.primary.past_title}</h3>
            </div>
            <div className={styles.jury__past_icon}>
              <div className={styles.jury__past_icondiv}></div>
              <div
                className={`${styles.jury__past_icondiv} ${pastOpen ? styles.open : ''}`}
              ></div>
            </div>
          </button>
          <div
            id="jury-past-content"
            className={`${styles.jury__past_content} ${pastOpen ? styles.open : ''}`}
          >
            <div className={styles.jury__past_inner}>
              {pastByYear.map(([year, members]) => (
                <div key={year} className={styles.jury__past_year}>
                  {year > 0 && <h4>{year}</h4>}
                  <ul>
                    {members.map((member, memberIndex) => (
                      <li key={memberIndex} className={styles.jury__past_row}>
                        <span>{member.name}</span>
                        {isFilled.link(member.website) && (
                          <PrismicNextLink
                            field={member.website}
                            aria-label={`${slice.primary.link_text} – ${member.name}`}
                          >
                            {slice.primary.link_text}
                          </PrismicNextLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
