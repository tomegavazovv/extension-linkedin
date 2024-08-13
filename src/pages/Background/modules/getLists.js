const baseUrl = require('./baseUrl');
const { default: getAuthHeader } = require('./getAuthHeader');

async function getLists() {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${baseUrl}/list`, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();

  return data['data']['lists'];
}

module.exports = getLists;
