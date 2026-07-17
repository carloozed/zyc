import { notFound } from 'next/navigation';

import { createClient } from '@/prismicio';

import ImpressumDatenschutzContainer from '@/app/components/ImpressumDatenschutzContainer/ImpressumDatenschutzContainer';

export type LegalPageDocumentType = 'datenschutz' | 'impresssum';

type Props = {
  lang: string;
  documentType: LegalPageDocumentType;
};

// Shared scaffold for the Datenschutz and Impressum pages, which only
// differ by which singleton they fetch and which content group they render.
const LegalPage = async ({ lang, documentType }: Props) => {
  const client = createClient();

  if (documentType === 'datenschutz') {
    const page = await client
      .getSingle('datenschutz', { lang })
      .catch(() => notFound());

    return (
      <ImpressumDatenschutzContainer
        title={page.data.title}
        items={page.data.datenschutz_content}
      />
    );
  }

  const page = await client
    .getSingle('impresssum', { lang })
    .catch(() => notFound());

  return (
    <ImpressumDatenschutzContainer
      title={page.data.title}
      items={page.data.impressum_content}
    />
  );
};

export default LegalPage;
