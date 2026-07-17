import { type Metadata } from 'next';
import { asImageSrc, ImageField, KeyTextField } from '@prismicio/client';

type MetaFields = {
  meta_title: KeyTextField;
  meta_description: KeyTextField;
  meta_image: ImageField;
};

const buildPageMetadata = (data: MetaFields): Metadata => ({
  title: data.meta_title,
  description: data.meta_description,
  openGraph: { images: [{ url: asImageSrc(data.meta_image) ?? '' }] },
});

export default buildPageMetadata;
