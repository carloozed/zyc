import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import ContactAndDownloadContent from './ContactAndDownloadContent';

/**
 * Props for `ContactAndDownload`.
 */
export type ContactAndDownloadProps =
  SliceComponentProps<Content.ContactAndDownloadSlice>;

/**
 * Component for "ContactAndDownload" Slices.
 */
const ContactAndDownload: FC<ContactAndDownloadProps> = ({ slice }) => {
  return <ContactAndDownloadContent slice={slice} />;
};

export default ContactAndDownload;
