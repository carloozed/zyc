'use client';

import { isFilled } from '@prismicio/client';

import { RegularSliceProps } from '../types';
import { useFoldoutElements } from '../useFoldoutElements';
import FoldoutItem from '../FoldoutItem';

import generalStyles from '../GeneralStyles.module.css';
import { RevealText } from '@/app/components/RevealText/RevealText';

type Props = {
  regularProps: RegularSliceProps;
};

export default function RegularSlice({ regularProps }: Props) {
  const { slice, foldoutElements } = regularProps;
  const { matchingElements, openElementIndex, toggleElement } =
    useFoldoutElements(foldoutElements, slice.primary.foldout_name);

  if (!(slice.variation === 'default' && slice.primary.section_is_shown)) {
    return null;
  }

  return (
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
        {matchingElements.map((element, elementIndex) => (
          <FoldoutItem
            key={element.id}
            element={element}
            displayNumber={elementIndex + 1}
            isOpen={openElementIndex === elementIndex}
            onToggle={() => toggleElement(elementIndex)}
          />
        ))}
      </div>
    </div>
  );
}
