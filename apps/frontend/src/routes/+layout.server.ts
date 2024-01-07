import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
  const isLoggedIn = !!cookies.get('authorization');
  return { isLoggedIn };
};
