'use client';

import { CSSProperties } from 'react';
import { PrismicNextImage } from '@prismicio/next';

import { FoldoutelementDocument } from '@/prismicio-types';

import { ImageSliceProps } from '../types';
import { useFoldoutElements } from '../useFoldoutElements';
import FoldoutItem, { FoldoutItemDescriptionComponents } from '../FoldoutItem';

import generalStyles from '../GeneralStyles.module.css';
import imageSliceStyles from './ImageSlice.module.css';

const HIGHLIGHT_COLORS: Record<string, string> = {
  contestfaq: 'var(--contestblue)',
  cadenzafaq: 'var(--cadenzagold)',
  crescendofaq: 'var(--crescendogold)',
};

function getHeaderStyle(element: FoldoutelementDocument): CSSProperties {
  if (element.data.itemindex !== 1) {
    return { backgroundColor: 'white' };
  }

  const belongsTo = element.data.belongs_to_foldout ?? '';
  return { backgroundColor: HIGHLIGHT_COLORS[belongsTo] ?? 'white' };
}

const descriptionComponents: FoldoutItemDescriptionComponents = {
  hyperlink: ({ node, children }) => (
    <a href={node.data.url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

type Props = {
  imageSliceProps: ImageSliceProps;
};

export default function ImageSlice({ imageSliceProps }: Props) {
  const { slice, foldoutElements } = imageSliceProps;
  const { matchingElements, openElementIndex, toggleElement } =
    useFoldoutElements(foldoutElements, slice.primary.foldout_name, {
      onlyVisible: true,
    });

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
        {matchingElements.map((element, elementIndex) => (
          <FoldoutItem
            key={element.id}
            element={element}
            displayNumber={elementIndex + 1}
            isOpen={openElementIndex === elementIndex}
            onToggle={() => toggleElement(elementIndex)}
            headerStyle={getHeaderStyle(element)}
            hideHiddenContent
            descriptionComponents={descriptionComponents}
          />
        ))}
      </div>
    </div>
  );
}
