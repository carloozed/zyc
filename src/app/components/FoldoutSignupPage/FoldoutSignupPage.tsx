import { notFound } from 'next/navigation';

import { createClient } from '@/prismicio';

import CadenzaContent from '@/app/[lang]/the_cadenza/CadenzaContent';
import CreschendoContent from '@/app/[lang]/the_crescendo/CrescendoContent/CreschendoContent';

export type FoldoutSignupPageDocumentType = 'the_cadenza' | 'the_crescendo';

type Props = {
  lang: string;
  documentType: FoldoutSignupPageDocumentType;
};

// Shared scaffold for the Cadenza and Crescendo pages, which both fetch the
// same foldout elements and signup link and only differ by which singleton
// they fetch and which Content component renders it.
const FoldoutSignupPage = async ({ lang, documentType }: Props) => {
  const client = createClient();
  const foldoutElements = await client
    .getAllByType('foldoutelement', { lang })
    .catch(() => notFound());
  const signuplink = await client.getSingle('anmeldelink', { lang });

  if (documentType === 'the_cadenza') {
    const page = await client
      .getSingle('the_cadenza', { lang })
      .catch(() => notFound());

    return (
      <CadenzaContent
        page={page}
        foldoutElements={foldoutElements}
        signuplink={signuplink}
      />
    );
  }

  const page = await client
    .getSingle('the_crescendo', { lang })
    .catch(() => notFound());

  return (
    <CreschendoContent
      page={page}
      foldoutElements={foldoutElements}
      signuplink={signuplink}
    />
  );
};

export default FoldoutSignupPage;
