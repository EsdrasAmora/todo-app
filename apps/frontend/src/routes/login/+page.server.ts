import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const authorization = cookies.get('authorization');
  if (!!authorization) {
    //would be cool if we showed a toast after redirecting
    redirect(302, '/');
  }
};
