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
import Ornament from './Ornament';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { siteEase } from '@/helpers/siteEase';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = { slice: JuryGridSlice; lang?: string };

// Fallback for the "Coming soon" placeholder when the slice's own title is
// empty; same wording in both locales.
const COMING_SOON_FALLBACK_TITLE = '2027: Coming soon';

export default function JuryContent({ slice, lang }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [openYears, setOpenYears] = useState<ReadonlySet<number>>(new Set());

  const toggleYear = (year: number) => {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  // The toggle was added after the documents were published, so the API
  // returns undefined for it on untouched documents — only an explicit
  // "false" hides the current jury behind the placeholder.
  const juryPublished = slice.primary.current_jury_published !== false;
  const comingSoonTitle = isFilled.keyText(slice.primary.coming_soon_title)
    ? slice.primary.coming_soon_title
    : COMING_SOON_FALLBACK_TITLE;
  const comingSoonText = isFilled.richText(slice.primary.coming_soon_text) ? (
    <PrismicRichText field={slice.primary.coming_soon_text} />
  ) : null;

  // Rows are entered flat in Prismic; the year number on each row decides
  // which edition it belongs to. Members serving several editions get one
  // row per year. Missing years sink to the bottom instead of disappearing.
  // The group heading is the rows' optional Edition label (e.g. "2025/2026")
  // or, when none is filled, the site's default edition naming derived from
  // the year — same convention as the gallery's edition_year/year_in_number.
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
    return [...byYear.entries()]
      .sort(([a], [b]) => b - a)
      .map(([year, members]) => ({
        year,
        label:
          members.find((m) => isFilled.keyText(m.edition))?.edition ??
          (year > 0 ? `${year}/${year + 1}` : ''),
        members,
      }));
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
      <div className={styles.jury__current}>
        {isFilled.keyText(slice.primary.season_label) && (
          <p className={`jury-fade ${styles.jury__season}`}>
            {slice.primary.season_label}
          </p>
        )}
        {!juryPublished && (
          <div className={`jury-fade ${styles.jury__placeholder}`}>
            <Ornament className={styles.jury__placeholder_ornament} />
            <p className={styles.jury__placeholder_title}>{comingSoonTitle}</p>
            {comingSoonText && (
              <div className={styles.jury__placeholder_text}>
                {comingSoonText}
              </div>
            )}
            <Ornament className={styles.jury__placeholder_ornament} />
          </div>
        )}
        <div className={styles.jury__members} hidden={!juryPublished}>
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
      </div>
      {pastByYear.length > 0 && (
        <div className={`jury-fade ${styles.jury__past}`}>
          <div className={styles.jury__past_years}>
            {pastByYear.map(({ year, label, members }) => {
              const isOpen = openYears.has(year);
              return (
                <div key={year} className={styles.jury__past_year}>
                  <button
                    type="button"
                    className={styles.jury__past_toggle}
                    onClick={() => toggleYear(year)}
                    aria-expanded={isOpen}
                    aria-controls={`jury-past-content-${year}`}
                  >
                    <h3>
                      {label ||
                        (lang === 'en-us' ? 'Earlier years' : 'Frühere Jahre')}
                    </h3>
                    <div className={styles.jury__past_icon}>
                      <div className={styles.jury__past_icondiv}></div>
                      <div
                        className={`${styles.jury__past_icondiv} ${isOpen ? styles.open : ''}`}
                      ></div>
                    </div>
                  </button>
                  <div
                    id={`jury-past-content-${year}`}
                    className={`${styles.jury__past_content} ${isOpen ? styles.open : ''}`}
                  >
                    <div className={styles.jury__past_inner}>
                      <ul>
                        {members.map((member, memberIndex) => (
                          <li
                            key={memberIndex}
                            className={styles.jury__past_row}
                          >
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
