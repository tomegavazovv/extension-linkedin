const baseUrl = require('./baseUrl');
const { default: getAuthHeader } = require('./getAuthHeader');

async function getListUrl(listId, selectedDate) {
  const authHeader = await getAuthHeader();
  const res = await fetch(
    `${baseUrl}/list/${listId}/getListUrl?date=${
      selectedDate ? selectedDate : 'past-24h'
    }`,
    {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    }
  );
  return await res.text();
}

module.exports = getListUrl;
