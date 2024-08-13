import baseUrl from './baseUrl';
import getAuthHeader from './getAuthHeader';

const getSkippedPosts = async (listId) => {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${baseUrl}/list/${listId}/skipped`, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
  });

  return res;
};

export default getSkippedPosts;
