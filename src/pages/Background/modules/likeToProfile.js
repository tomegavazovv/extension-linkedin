const baseUrl = require('./baseUrl');
const { default: getAuthHeader } = require('./getAuthHeader');

async function likeToProfile(listId, urn, postUrn) {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${baseUrl}/list/${listId}/likeToProfile`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urn,
      postUrn,
    }),
  });

  return res;
}

module.exports = likeToProfile;
