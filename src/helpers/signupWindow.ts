import { AnmeldelinkDocument } from '@/prismicio-types';

/** Today's date in Zurich as `YYYY-MM-DD`, whatever the visitor's or server's timezone. */
function todayInZurich(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Zurich',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/**
 * True while the sign-up link should be shown: from `show_button_date`
 * (inclusive) until `hide_button_date` (exclusive), both read as Swiss
 * calendar days, unless `hide_button_boolean` is set.
 */
export default function isSignupOpen(
  signuplink: AnmeldelinkDocument,
  now = new Date(),
) {
  const { show_button_date, hide_button_date, hide_button_boolean } =
    signuplink.data;
  if (hide_button_boolean) return false;
  if (!show_button_date) return false;
  const today = todayInZurich(now);
  return (
    today >= show_button_date && (!hide_button_date || today < hide_button_date)
  );
}
