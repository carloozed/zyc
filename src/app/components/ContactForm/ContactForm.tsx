import FormContent from './FormContent';
import { createClient } from '@/prismicio';

type ContactFormProps = {
  lang: string;
};

export default async function ContactForm({ lang }: ContactFormProps) {
  const client = createClient();

  const contactForm = await client.getSingle('contact_form', { lang });

  return <FormContent contactForm={contactForm} />;
}
