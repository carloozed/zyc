import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import ContactAndDownloadContent from './ContactAndDownloadContent';
import { AnmeldelinkDocument } from '../../../prismicio-types';

/**
 * Props for `ContactAndDownload`.
 */
export type ContactAndDownloadProps =
  SliceComponentProps<Content.ContactAndDownloadSlice>;

type ContestAndDownloadContext = {
  isDownloadsMuted: Content.IsdownloadsmutedDocument;
  signuplink: AnmeldelinkDocument;
};

/**
 * Component for "ContactAndDownload" Slices.
 */
const ContactAndDownload: FC<ContactAndDownloadProps> = ({
  slice,
  context,
}) => {
  const { isDownloadsMuted, signuplink } = context as ContestAndDownloadContext;
  return (
    <ContactAndDownloadContent
      slice={slice}
      isDownloadsMuted={isDownloadsMuted}
      signuplink={signuplink}
    />
  );
};

export default ContactAndDownload;
