import { type Metadata } from 'next';

import FoldoutSignupPage from '@/app/components/FoldoutSignupPage/FoldoutSignupPage';
import buildFoldoutSignupPageMetadata from '@/helpers/buildFoldoutSignupPageMetadata';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return <FoldoutSignupPage lang={lang} documentType="the_crescendo" />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return buildFoldoutSignupPageMetadata({
    lang,
    documentType: 'the_crescendo',
  });
}
