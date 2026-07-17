import { type Metadata } from 'next';

import LegalPage from '@/app/components/LegalPage/LegalPage';
import buildLegalPageMetadata from '@/helpers/buildLegalPageMetadata';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return <LegalPage lang={lang} documentType="datenschutz" />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return buildLegalPageMetadata({ lang, documentType: 'datenschutz' });
}
