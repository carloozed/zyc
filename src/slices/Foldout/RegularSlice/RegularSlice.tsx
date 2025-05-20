import React from 'react';
import { PrismicRichText } from '@prismicio/react';
import { isFilled } from '@prismicio/client';
import { regularPropsType } from '../FoldoutContent';

import generalStyles from '../GeneralStyles.module.css';

// The props type should match what you're receiving
type Props = {
  regularProps: regularPropsType;
};

export default function RegularSlice({ regularProps }: Props) {
  const { slice, foldoutElements } = regularProps;

  const mappingArray = foldoutElements.find((item) => {
    return item && item.data.belongs_to_foldout === slice.primary.foldout_name;
  });

  return (
    <div className={generalStyles.foldout}>
      {isFilled.richText(slice.primary.section_title) && (
        <div className={generalStyles.foldout__section_title}>
          <PrismicRichText field={slice.primary.section_title} />
        </div>
      )}
      <div className={generalStyles.foldout__itemcontainer}>
        {mappingArray?.data.content.map((item, index: number) => {
          return (
            isFilled.richText(item.subtopic_title) && (
              <div key={index} className={generalStyles.foldout__item}>
                <div className={generalStyles.foldout__item_uppercontainer}>
                  <div className={generalStyles.index}>
                    <h4>{index + 1}</h4>
                  </div>
                  <div className={generalStyles.foldout__item_title}>
                    <PrismicRichText field={item.subtopic_title} />
                  </div>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}
