import { ImageField, isFilled } from '@prismicio/client';
import { MagazinpostDocumentDataGalleryItem } from '@/prismicio-types';

export type GalleryMedia =
  | { kind: 'image'; image: ImageField }
  | {
      kind: 'video';
      src: string;
      type: string;
      // Still shown in the gallery strip and before playback starts.
      poster?: string;
      alt: string;
    };

const VIDEO_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  m4v: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  ogv: 'video/ogg',
};

function videoType(src: string) {
  const extension = new URL(src).pathname.split('.').pop()?.toLowerCase();
  return VIDEO_TYPES[extension ?? ''] ?? 'video/mp4';
}

// Cloudinary renders a still for any video when the extension is swapped to
// .jpg, so a Cloudinary video without an uploaded image still gets a poster.
function cloudinaryPoster(src: string) {
  const url = new URL(src);
  if (!url.hostname.endsWith('cloudinary.com')) return undefined;
  if (!url.pathname.includes('/video/upload/')) return undefined;
  url.pathname = url.pathname.replace(/\.[a-z0-9]+$/i, '') + '.jpg';
  return url.toString();
}

// A gallery row is a video when its video link is filled; its image, if any,
// then serves as the poster. Rows with neither are dropped.
export function toGalleryMedia(
  items: MagazinpostDocumentDataGalleryItem[],
): GalleryMedia[] {
  return items.flatMap((item): GalleryMedia[] => {
    const video = item.video;
    if (isFilled.link(video) && 'url' in video && video.url) {
      return [
        {
          kind: 'video',
          src: video.url,
          type: videoType(video.url),
          poster: isFilled.image(item.image)
            ? (item.image.url ?? undefined)
            : cloudinaryPoster(video.url),
          alt: item.image.alt ?? '',
        },
      ];
    }
    if (isFilled.image(item.image)) {
      return [{ kind: 'image', image: item.image }];
    }
    return [];
  });
}
