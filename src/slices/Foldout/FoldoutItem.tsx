import { ComponentProps, CSSProperties } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { isFilled } from '@prismicio/client';

import { FoldoutelementDocument } from '@/prismicio-types';

import generalStyles from './GeneralStyles.module.css';

export type FoldoutItemDescriptionComponents = ComponentProps<
  typeof PrismicRichText
>['components'];

type Props = {
  element: FoldoutelementDocument;
  displayNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  /** Inline style applied to both the index and the title (highlight colours). */
  headerStyle?: CSSProperties;
  /** When true, content entries flagged as hidden are skipped. */
  hideHiddenContent?: boolean;
  descriptionComponents?: FoldoutItemDescriptionComponents;
};

/**
 * A single foldout row shared by both the regular and image variations: the
 * clickable header (index, title, toggle icon) and the expandable content body.
 */
export default function FoldoutItem({
  element,
  displayNumber,
  isOpen,
  onToggle,
  headerStyle,
  hideHiddenContent = false,
  descriptionComponents,
}: Props) {
  const topic = element.data.foldout_element_topic;

  return (
    <div className={generalStyles.foldout__item}>
      <div
        className={generalStyles.foldout__item_uppercontainer}
        onClick={onToggle}
      >
        <div className={generalStyles.index} style={headerStyle}>
          <h4>{displayNumber}</h4>
        </div>

        <div className={generalStyles.foldout__item_title} style={headerStyle}>
          {topic && topic.length > 0 && isFilled.richText(topic) && (
            <PrismicRichText field={topic} />
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
      >
        {element.data.content &&
          element.data.content.map((item, contentIndex) => {
            if (!item || (hideHiddenContent && item.is_hidden)) return null;

            return (
              <div
                key={contentIndex}
                className={generalStyles.foldout__subitem}
              >
                <div className={generalStyles.foldout__subitem_title}>
                  {isFilled.richText(item.subtopic_title) && (
                    <div className={generalStyles.foldout__subitem_titlediv}>
                      <h4>&#8594;</h4>
                      <PrismicRichText field={item.subtopic_title} />
                    </div>
                  )}
                </div>

                <div className={generalStyles.foldout__subitem_description}>
                  {isFilled.richText(item.subtopic_description) && (
                    <PrismicRichText
                      field={item.subtopic_description}
                      components={descriptionComponents}
                    />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
