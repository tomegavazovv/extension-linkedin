import baseUrl from './baseUrl';
import getAuthHeader from './getAuthHeader';

const skipPost = async (listId, urn) => {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${baseUrl}/list/${listId}/skipped`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urn,
    }),
  });

  return res;
};

export default skipPost;
