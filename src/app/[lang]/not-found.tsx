import NotFoundContent from '@/app/components/NotFound/NotFoundContent';

// Rendered inside the [lang] layout (header, footer) whenever a page in this
// segment calls notFound() or the catch-all route below matches.
export default function NotFound() {
  return <NotFoundContent />;
}
