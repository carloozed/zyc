import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

import ContactAndDownloadsSections, {
  ContactAndDownloadsSection,
} from '@/app/components/ContactAndDownloads/ContactAndDownloadsSections';
import {
  AnmeldelinkDocument,
  ContactAndDownloadsDocument,
} from '@/prismicio-types';

/**
 * Props for `ContactAndDownload`.
 */
export type ContactAndDownloadProps =
  SliceComponentProps<Content.ContactAndDownloadSlice>;

type ContactAndDownloadContext = {
  contactAndDownloads?: ContactAndDownloadsDocument | null;
  signuplink?: AnmeldelinkDocument;
};

/**
 * The slice only decides *where* the shared "Contact & Downloads" content
 * appears; the text and links live in the contact_and_downloads singleton.
 */
const SECTIONS_BY_VARIATION: Record<
  Content.ContactAndDownloadSlice['variation'],
  ContactAndDownloadsSection[]
> = {
  default: ['contact', 'downloads'],
  justOneElement: ['newsletter'],
};

/**
 * Component for "ContactAndDownload" Slices.
 */
const ContactAndDownload: FC<ContactAndDownloadProps> = ({
  slice,
  context,
}) => {
  const { contactAndDownloads, signuplink } =
    context as ContactAndDownloadContext;
  if (!contactAndDownloads) return null;

  return (
    <ContactAndDownloadsSections
      doc={contactAndDownloads}
      sections={SECTIONS_BY_VARIATION[slice.variation]}
      signuplink={slice.variation === 'default' ? signuplink : undefined}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    />
  );
};

export default ContactAndDownload;
