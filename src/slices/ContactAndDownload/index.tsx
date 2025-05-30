import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import ContactAndDownloadContent from './ContactAndDownloadContent';

/**
 * Props for `ContactAndDownload`.
 */
export type ContactAndDownloadProps =
  SliceComponentProps<Content.ContactAndDownloadSlice>;

type ContestAndDownloadContext = {
  isDownloadsMuted: Content.IsdownloadsmutedDocument;
};

/**
 * Component for "ContactAndDownload" Slices.
 */
const ContactAndDownload: FC<ContactAndDownloadProps> = ({
  slice,
  context,
}) => {
  const { isDownloadsMuted } = context as ContestAndDownloadContext;
  return (
    <ContactAndDownloadContent
      slice={slice}
      isDownloadsMuted={isDownloadsMuted}
    />
  );
};

export default ContactAndDownload;
