import React from 'react';

import { FoldoutSlice } from '../../../prismicio-types';

export default function FoldoutContent({ slice }: { slice: FoldoutSlice }) {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    ></section>
  );
}
