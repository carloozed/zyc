import { MagazinpostDocument } from '@/prismicio-types';

const FOCUS_TAG = 'fokus';

export type PostMonthGroup = {
  label: string;
  posts: MagazinpostDocument[];
};

/**
 * Posts ordered by publishing date, newest first.
 */
export function sortPostsByDateDesc(
  posts: MagazinpostDocument[],
): MagazinpostDocument[] {
  return [...posts].sort((a, b) =>
    (b.data.publishing_date ?? '').localeCompare(a.data.publishing_date ?? ''),
  );
}

/**
 * The distinct tag values used across the given posts, in first-seen order.
 */
export function getUniquePostTags(posts: MagazinpostDocument[]) {
  return [
    ...new Set(posts.flatMap((post) => post.data.tags.map((tag) => tag.item))),
  ];
}

/**
 * Posts whose tags include the selected filter (case-insensitive). An empty
 * filter returns every post unchanged.
 */
export function filterPostsByTag(
  posts: MagazinpostDocument[],
  filter: string | null,
): MagazinpostDocument[] {
  if (!filter) return posts;
  return posts.filter((post) =>
    post.data.tags.some((tag) => tag.item?.toLowerCase() === filter),
  );
}

/**
 * Posts flagged with the editorial focus tag, newest first.
 */
export function getHighlightedPosts(
  posts: MagazinpostDocument[],
): MagazinpostDocument[] {
  return sortPostsByDateDesc(
    posts.filter((post) => post.tags.includes(FOCUS_TAG)),
  );
}

/**
 * Groups posts by publishing month, newest month first. Posts without a
 * publishing date are omitted.
 */
export function groupPostsByMonth(
  posts: MagazinpostDocument[],
): PostMonthGroup[] {
  const grouped: Record<string, MagazinpostDocument[]> = {};

  posts.forEach((post) => {
    const date = post.data.publishing_date
      ? new Date(post.data.publishing_date)
      : null;

    if (date) {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(post);
    }
  });

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    return yearB - yearA || monthB - monthA;
  });

  return sortedKeys.map((key) => {
    const [year, month] = key.split('-').map(Number);
    const label = new Date(year, month).toLocaleDateString('de-CH', {
      month: 'long',
      year: 'numeric',
    });
    return { label, posts: grouped[key] };
  });
}
