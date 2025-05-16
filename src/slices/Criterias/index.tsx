import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import CriteriasContent from './CriteriasContent';

/**
 * Props for `Criterias`.
 */
export type CriteriasProps = SliceComponentProps<Content.CriteriasSlice>;

export type CriteriasContext = {
  disciplinetypes: Content.CriteriatypesubfieldDocument[];
  signuplink: Content.AnmeldelinkDocument;
};

/**
 * Props for `Criterias` with context.
 */

export type CriteriasWithContextProps = SliceComponentProps<
  Content.CriteriasSlice,
  CriteriasContext
>;

/**
 * Component for "Criterias" Slices.
 */
const Criterias: FC<CriteriasWithContextProps> = ({ slice, context }) => {
  const { disciplinetypes, signuplink } = context as CriteriasContext;
  return (
    <CriteriasContent
      slice={slice}
      disciplinetypes={disciplinetypes}
      signuplink={signuplink}
    />
  );
};

export default Criterias;
