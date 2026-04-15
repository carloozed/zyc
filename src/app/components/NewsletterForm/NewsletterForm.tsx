import FormContent from './FormContent';
import { createClient } from '@/prismicio';

type NewsletterFormProps = {
  lang: string;
};

export default async function NewsletterForm({ lang }: NewsletterFormProps) {
  const client = createClient();

  const newsletter = await client.getSingle('newsletter_form', { lang });

  return <FormContent newsletter={newsletter} />;
}
