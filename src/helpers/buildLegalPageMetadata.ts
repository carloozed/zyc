import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { createClient } from '@/prismicio';
import buildPageMetadata from '@/helpers/buildPageMetadata';
import { type LegalPageDocumentType } from '@/app/components/LegalPage/LegalPage';

type Props = {
  lang: string;
  documentType: LegalPageDocumentType;
};

// Metadata counterpart of LegalPage: fetches the same singleton and builds
// the shared meta_* Metadata object.
const buildLegalPageMetadata = async ({
  lang,
  documentType,
}: Props): Promise<Metadata> => {
  const client = createClient();
  const page =
    documentType === 'datenschutz'
      ? await client.getSingle('datenschutz', { lang }).catch(() => notFound())
      : await client.getSingle('impresssum', { lang }).catch(() => notFound());

  return buildPageMetadata(page.data);
};

export default buildLegalPageMetadata;
