'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { isFilled } from '@prismicio/client';
import { regularPropsType } from '../FoldoutContent';

import generalStyles from '../GeneralStyles.module.css';

type Props = {
  regularProps: regularPropsType;
};

export default function RegularSlice({ regularProps }: Props) {
  const { slice, foldoutElements } = regularProps;
  const [openElementIndex, setOpenElementIndex] = useState<number | null>(null);

  // Create refs for each element using arrays
  const upperContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const matchingElements = foldoutElements
    .filter((item) => {
      return (
        item && item.data.belongs_to_foldout === slice.primary.foldout_name
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

  useLayoutEffect(() => {
    matchingElements.forEach((_, index) => {
      const mainContainer = mainContainerRefs.current[index];
      const upperContainer = upperContainerRefs.current[index];
      const contentContainer = contentRefs.current[index];

      if (mainContainer && upperContainer && contentContainer) {
        const upperHeight = upperContainer.offsetHeight;
        const contentHeight = contentContainer.offsetHeight;

        if (index === openElementIndex) {
          mainContainer.style.height = `${upperHeight + contentHeight}px`;
        } else {
          mainContainer.style.height = `calc(${upperHeight}px + 1px)`;
        }
      }
    });
  }, [openElementIndex, matchingElements]);

  return (
    <div className={generalStyles.foldout}>
      {isFilled.richText(slice.primary.section_title) && (
        <div className={generalStyles.foldout__section_title}>
          <PrismicRichText field={slice.primary.section_title} />
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
            <div
              key={element.id}
              className={generalStyles.foldout__item}
              ref={(el) => {
                mainContainerRefs.current[elementIndex] = el;
              }}
              style={{
                height: 'auto',
                overflow: 'hidden',
                transition: 'height 0.3s var(--bezier)',
              }}
            >
              <div
                className={generalStyles.foldout__item_uppercontainer}
                onClick={() => toggleElement(elementIndex)}
                ref={(el) => {
                  upperContainerRefs.current[elementIndex] = el;
                }}
              >
                <div className={generalStyles.index}>
                  <h4>{elementIndex + 1}</h4>
                </div>

                <div className={generalStyles.foldout__item_title}>
                  {element.data.foldout_element_topic &&
                    element.data.foldout_element_topic.length > 0 &&
                    isFilled.richText(element.data.foldout_element_topic) && (
                      <PrismicRichText
                        field={element.data.foldout_element_topic}
                      />
                    )}
                </div>

                <div className={generalStyles.foldout__toggle_icon}>
                  <div className={generalStyles.foldout__toggle_icondiv}></div>
                  <div
                    className={`${generalStyles.foldout__toggle_icondiv} ${isOpen ? generalStyles.open : ''}`}
                  ></div>
                </div>
              </div>

              <div
                className={generalStyles.foldout__item_content}
                ref={(el) => {
                  contentRefs.current[elementIndex] = el;
                }}
                style={{
                  display: isOpen ? 'block' : 'none',
                  visibility: isOpen ? 'visible' : 'hidden',
                }}
              >
                {element.data.content &&
                  element.data.content.map((item, contentIndex) => {
                    if (!item) return null;

                    return (
                      <div
                        key={contentIndex}
                        className={generalStyles.foldout__subitem}
                      >
                        <div className={generalStyles.foldout__subitem_title}>
                          {isFilled.richText(item.subtopic_title) && (
                            <div
                              className={
                                generalStyles.foldout__subitem_titlediv
                              }
                            >
                              <h4>&#8594;</h4>
                              <PrismicRichText field={item.subtopic_title} />
                            </div>
                          )}
                        </div>

                        <div
                          className={generalStyles.foldout__subitem_description}
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
  );
}
