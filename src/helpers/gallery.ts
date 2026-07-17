import { Content } from '@prismicio/client';

export type GalleryImage = Content.GalleryYearSliceDefaultPrimaryGalleryItem;

export type GallerySlide = {
  src: string;
  alt: string;
};

/**
 * Context passed by GalleryContent to every slice rendered in its SliceZones.
 */
export type GalleryPageContext = {
  decoimage: Content.DecorationImageDocument;
  filter: string;
  sliceOffsets: Map<string, number>;
  onImageClick: (globalIndex: number) => void;
};

export function sortByDateAddedDesc<T extends { date_added: string | null }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) =>
    (b.date_added ?? '').localeCompare(a.date_added ?? ''),
  );
}

/**
 * The images of a gallery slice that are visible under the current event
 * filter, in display order. The lightbox slide indices are derived from this
 * list, so every place that renders or counts gallery images must go through
 * this helper.
 */
export function getVisibleGalleryImages(
  images: GalleryImage[],
  filter: string,
): GalleryImage[] {
  return sortByDateAddedDesc(images).filter(
    (image) => !filter || image.eventtag?.toLowerCase() === filter,
  );
}

export function sortVideosByIndex<T extends { index: number | null }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
}

/**
 * Slices sorted by edition year (newest first), filtered by the year selected
 * in the edition dropdown ('alle' or '' shows every year).
 */
export function getVisibleYearSlices<
  T extends { primary: { year_in_number: number | null } },
>(slices: T[], galleryYear: string): T[] {
  const sorted = [...slices].sort(
    (a, b) => (b.primary.year_in_number ?? 0) - (a.primary.year_in_number ?? 0),
  );

  const yearNumber = Number(galleryYear);
  if (!galleryYear || galleryYear === 'alle' || isNaN(yearNumber)) {
    return sorted;
  }

  return sorted.filter((slice) => slice.primary.year_in_number === yearNumber);
}
