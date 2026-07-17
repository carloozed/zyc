import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { createClient } from '@/prismicio';
import buildPageMetadata from '@/helpers/buildPageMetadata';
import { type FoldoutSignupPageDocumentType } from '@/app/components/FoldoutSignupPage/FoldoutSignupPage';

type Props = {
  lang: string;
  documentType: FoldoutSignupPageDocumentType;
};

// Metadata counterpart of FoldoutSignupPage: fetches the same singleton and
// builds the shared meta_* Metadata object.
const buildFoldoutSignupPageMetadata = async ({
  lang,
  documentType,
}: Props): Promise<Metadata> => {
  const client = createClient();
  const page =
    documentType === 'the_cadenza'
      ? await client.getSingle('the_cadenza', { lang }).catch(() => notFound())
      : await client.getSingle('the_crescendo', { lang }).catch(() => notFound());

  return buildPageMetadata(page.data);
};

export default buildFoldoutSignupPageMetadata;
