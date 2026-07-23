'use client';

import React, { useState } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { isFilled } from '@prismicio/client';
import { regularPropsType } from '../FoldoutContent';

import generalStyles from '../GeneralStyles.module.css';
import { RevealText } from '@/app/components/RevealText/RevealText';

type Props = {
  regularProps: regularPropsType;
};

export default function RegularSlice({ regularProps }: Props) {
  const { slice, foldoutElements } = regularProps;
  const [openElementIndex, setOpenElementIndex] = useState<number | null>(null);

  const matchingElements = foldoutElements
    .filter((item) => {
      return (
        item &&
        item.data.belongs_to_foldout === slice.primary.foldout_name &&
        item.data.is_visible === true
      );
    })
    .sort((a, b) => {
      const aIndex = a.data.itemindex || 0;
      const bIndex = b.data.itemindex || 0;
      return aIndex - bIndex;
    });

  const toggleElement = (index: number) => {
    setOpenElementIndex(openElementIndex === index ? null : index);
  };

  return (
    <>
      {slice.variation === 'default' && slice.primary.section_is_shown && (
        <div className={generalStyles.foldout}>
          {isFilled.richText(slice.primary.section_title) && (
            <div className={generalStyles.foldout__section_title}>
              <RevealText
                field={slice.primary.section_title}
                useScrollTrigger={true}
                as={'h2'}
                staggerAmount={0}
              />
            </div>
          )}

          <div
            className={generalStyles.foldout__itemcontainer}
            style={{
              backgroundColor: 'var(--lightgrey)',
              borderTop: 'var(--border-thin)',
              borderBottom: 'var(--border-thin)',
            }}
          >
            {matchingElements.map((element, elementIndex) => {
              const isOpen = openElementIndex === elementIndex;

              return (
                <div key={element.id} className={generalStyles.foldout__item}>
                  <button
                    type="button"
                    className={generalStyles.foldout__item_uppercontainer}
                    onClick={() => toggleElement(elementIndex)}
                    aria-expanded={isOpen}
                    aria-controls={`foldout-content-${element.id}`}
                  >
                    <div className={generalStyles.index}>
                      <span>{elementIndex + 1}</span>
                    </div>

                    <div className={generalStyles.foldout__item_title}>
                      {element.data.foldout_element_topic &&
                        element.data.foldout_element_topic.length > 0 &&
                        isFilled.richText(
                          element.data.foldout_element_topic
                        ) && (
                          <PrismicRichText
                            field={element.data.foldout_element_topic}
                          />
                        )}
                    </div>

                    <div className={generalStyles.foldout__toggle_icon}>
                      <div
                        className={generalStyles.foldout__toggle_icondiv}
                      ></div>
                      <div
                        className={`${generalStyles.foldout__toggle_icondiv} ${isOpen ? generalStyles.open : ''}`}
                      ></div>
                    </div>
                  </button>

                  <div
                    id={`foldout-content-${element.id}`}
                    className={`${generalStyles.foldout__item_content} ${isOpen ? generalStyles.open : generalStyles.closed}`}
                  >
                    {element.data.content &&
                      element.data.content.map((item, contentIndex) => {
                        if (!item || item.is_hidden) return null;

                        return (
                          <div
                            key={contentIndex}
                            className={generalStyles.foldout__subitem}
                          >
                            <div
                              className={generalStyles.foldout__subitem_title}
                            >
                              {isFilled.richText(item.subtopic_title) && (
                                <div
                                  className={
                                    generalStyles.foldout__subitem_titlediv
                                  }
                                >
                                  <span aria-hidden="true">&#8594;</span>
                                  <PrismicRichText
                                    field={item.subtopic_title}
                                  />
                                </div>
                              )}
                            </div>

                            <div
                              className={
                                generalStyles.foldout__subitem_description
                              }
                            >
                              {isFilled.richText(item.subtopic_description) && (
                                <PrismicRichText
                                  field={item.subtopic_description}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
