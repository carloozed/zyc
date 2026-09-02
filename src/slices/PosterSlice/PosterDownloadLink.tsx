'use client';

import {
  isFilled,
  type FilledLinkToMediaField,
  type LinkToMediaField,
} from '@prismicio/client';
import DownloadIcon from '@/app/components/DownloadIcon/DownloadIcon';
import { downloadFile } from '@/helpers/downloadFile';

type Props = { field: LinkToMediaField };

/**
 * Prismic's image CDN is imgix, which turns `?dl=<name>` into a
 * `Content-Disposition: attachment` response of the original file. The
 * default query (`auto=format,compress`) is dropped on purpose: it would
 * deliver an AVIF/WebP under the original file name.
 */
function nativeDownloadUrl(field: FilledLinkToMediaField): string | null {
  const url = new URL(field.url);
  if (url.hostname !== 'images.prismic.io') return null;
  url.search = '';
  url.searchParams.set('dl', field.name);
  return url.toString();
}

export default function PosterDownloadLink({ field }: Props) {
  if (!isFilled.linkToMedia(field)) return null;

  const nativeUrl = nativeDownloadUrl(field);

  return (
    <a
      href={nativeUrl ?? field.url}
      download={field.name}
      aria-label={`Download: ${field.name}`}
      onClick={
        nativeUrl
          ? undefined
          : (event) => {
              // Other media (PDFs on the file CDN) are served inline, so
              // fetch the file and save it as a blob instead.
              event.preventDefault();
              void downloadFile(field.url, field.name);
            }
      }
    >
      <DownloadIcon width="2rem" height="2rem" strokeColor="black" />
    </a>
  );
}
