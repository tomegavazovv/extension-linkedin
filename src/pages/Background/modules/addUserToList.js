const baseUrl = require('./baseUrl');
const { default: getAuthHeader } = require('./getAuthHeader');

async function addUserToList(user, listId) {
  const authHeader = await getAuthHeader();
  const body = JSON.stringify({
    ...user,
  });
  console.log('sending request');
  const res = await fetch(`${baseUrl}/list/${listId}/add`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: body,
  });

  return res;
}

module.exports = addUserToList;
