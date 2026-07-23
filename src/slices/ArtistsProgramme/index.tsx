import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

import ArtistProgrammeContent from './components/ArtistsProgrammeContent/ArtistProgrammeContent';

export type ArtistsProgrammeProps =
  SliceComponentProps<Content.ArtistsProgrammeSlice>;

const ArtistsProgramme: FC<ArtistsProgrammeProps> = ({ slice }) => {
  return <ArtistProgrammeContent slice={slice} />;
};

export default ArtistsProgramme;
