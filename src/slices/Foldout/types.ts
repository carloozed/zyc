import {
  AnmeldelinkDocument,
  FoldoutelementDocument,
  FoldoutSlice,
  FoldoutSliceFoldoutWithImage,
} from '@/prismicio-types';

export type RegularSliceProps = {
  slice: FoldoutSlice;
  foldoutElements: FoldoutelementDocument[];
  signuplink: AnmeldelinkDocument;
};

export type ImageSliceProps = {
  slice: FoldoutSliceFoldoutWithImage;
  foldoutElements: FoldoutelementDocument[];
  signuplink: AnmeldelinkDocument;
};
