import FormContent from './FormContent';
import { createClient } from '@/prismicio';

export default async function NewsletterForm() {
  const client = createClient();

  const newsletter = await client.getSingle('newsletter_form');

  return <FormContent newsletter={newsletter} />;
}
