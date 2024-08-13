const baseUrl = require('./baseUrl');
const { default: getAuthHeader } = require('./getAuthHeader');

async function checkIfMonitored(publicId) {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${baseUrl}/users/checkMonitored/${publicId}`, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
  });

  return await res.json();
}

module.exports = checkIfMonitored;
