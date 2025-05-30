'use client';

import React, { useState, useRef } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { isFilled } from '@prismicio/client';

import { ImagePropsType } from '../FoldoutContent';

import generalStyles from '../GeneralStyles.module.css';

import imageSliceStyles from './ImageSlice.module.css';
import { PrismicNextImage } from '@prismicio/next';

type Props = {
  imageSliceProps: ImagePropsType;
};

export default function ImageSlice({ imageSliceProps }: Props) {
  const { slice, foldoutElements } = imageSliceProps;
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

  return (
    <div className={imageSliceStyles.foldout}>
      <div className={imageSliceStyles.foldout__imagecontainer}>
        <div className={imageSliceStyles.foldout__decorationcontainer}>
          <div className={imageSliceStyles.circle}></div>
          <div className={imageSliceStyles.string}></div>
          <div className={imageSliceStyles.circle}></div>
        </div>
        <PrismicNextImage field={slice.primary.foldout_image} />
        <div className={imageSliceStyles.foldout__decorationcontainer}>
          <div className={imageSliceStyles.circle}></div>
          <div className={imageSliceStyles.string}></div>
          <div className={imageSliceStyles.circle}></div>
        </div>
      </div>
      <div className={generalStyles.foldout__itemcontainer}>
        {matchingElements.map((element, elementIndex) => {
          const isOpen = openElementIndex === elementIndex;

          return (
            <div
              key={element.id}
              className={generalStyles.foldout__item}
              ref={(el) => {
                mainContainerRefs.current[elementIndex] = el;
              }}
            >
              <div
                className={generalStyles.foldout__item_uppercontainer}
                onClick={() => toggleElement(elementIndex)}
                ref={(el) => {
                  upperContainerRefs.current[elementIndex] = el;
                }}
              >
                <div
                  className={generalStyles.index}
                  style={{
                    backgroundColor:
                      element.data.belongs_to_foldout === 'contestfaq' &&
                      element.data.itemindex === 1
                        ? 'var(--contestblue)'
                        : 'transparent',
                  }}
                >
                  <h4>{elementIndex + 1}</h4>
                </div>

                <div
                  className={generalStyles.foldout__item_title}
                  style={{
                    backgroundColor:
                      element.data.belongs_to_foldout === 'contestfaq' &&
                      element.data.itemindex === 1
                        ? 'var(--contestblue)'
                        : 'transparent',
                  }}
                >
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
                className={`${generalStyles.foldout__item_content} ${isOpen ? generalStyles.open : generalStyles.closed}`}
                ref={(el) => {
                  contentRefs.current[elementIndex] = el;
                }}
              >
                {element.data.content &&
                  element.data.content.map((item, contentIndex) => {
                    if (!item || item.is_hidden) return null;

                    return (
                      <div
                        key={contentIndex}
                        className={generalStyles.foldout__subitem}
                        style={{ border: '1px solid red' }}
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
