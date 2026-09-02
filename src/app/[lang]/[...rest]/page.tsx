import { notFound } from 'next/navigation';

// Unmatched URLs under a locale would otherwise fall through to the root
// not-found page, which renders without the site's header and footer.
// Catching them here keeps the 404 inside the [lang] layout.
export default function CatchAll() {
  notFound();
}
