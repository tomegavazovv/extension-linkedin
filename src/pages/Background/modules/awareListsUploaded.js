const baseUrl = require('./baseUrl');
const { default: getAuthHeader } = require('./getAuthHeader');

async function awareListsUploaded() {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${baseUrl}/list/awareSynced`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
  });

  return res.status;
}

module.exports = awareListsUploaded;
