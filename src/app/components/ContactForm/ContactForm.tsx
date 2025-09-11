import FormContent from './FormContent';
import { createClient } from '@/prismicio';

export default async function ContactForm() {
  const client = createClient();

  const contactForm = await client.getSingle('contact_form');

  return <FormContent contactForm={contactForm} />;
}
