import { TimestampField } from '@prismicio/client';

const formatIsoToDate = (isoDate: string | TimestampField | undefined) => {
  const date = new Date(isoDate as string);

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

export default formatIsoToDate;
