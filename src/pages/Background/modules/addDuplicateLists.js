const baseUrl = require('./baseUrl');
const { default: getAuthHeader } = require('./getAuthHeader');

const addDuplicateLists = async (listId, count, loading) => {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${baseUrl}/list/${listId}/addDuplicateLists`, {
    method: 'POST',
    body: JSON.stringify({ count, loading }),
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  return data['data'];
};

module.exports = addDuplicateLists;
