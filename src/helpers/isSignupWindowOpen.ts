import { AnmeldelinkDocument } from '@/prismicio-types';

// The signup button is visible from show_button_date (inclusive) until
// hide_button_date (exclusive). No show date → never visible; no hide
// date → visible indefinitely once shown. Dates compared as UTC days.
const isSignupWindowOpen = (signuplink: AnmeldelinkDocument): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const showDate = signuplink.data.show_button_date?.split('T')[0];
  const hideDate = signuplink.data.hide_button_date?.split('T')[0];

  if (!showDate || today < showDate) return false;

  return !hideDate || today < hideDate;
};

export default isSignupWindowOpen;
