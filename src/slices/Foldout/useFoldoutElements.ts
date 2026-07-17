import { useState } from 'react';
import { FoldoutelementDocument } from '@/prismicio-types';

type UseFoldoutElementsOptions = {
  onlyVisible?: boolean;
};

/**
 * Shared state + selection logic for both Foldout variations: filters the
 * elements that belong to the given foldout, sorts them by item index and
 * tracks which element is currently open.
 */
export function useFoldoutElements(
  foldoutElements: FoldoutelementDocument[],
  foldoutName: string | null,
  { onlyVisible = false }: UseFoldoutElementsOptions = {},
) {
  const [openElementIndex, setOpenElementIndex] = useState<number | null>(null);

  const matchingElements = foldoutElements
    .filter((item) => item && item.data.belongs_to_foldout === foldoutName)
    .sort((a, b) => (a.data.itemindex || 0) - (b.data.itemindex || 0))
    .filter((item) => !onlyVisible || item.data.is_visible === true);

  const toggleElement = (index: number) => {
    setOpenElementIndex(openElementIndex === index ? null : index);
  };

  return { matchingElements, openElementIndex, toggleElement };
}
