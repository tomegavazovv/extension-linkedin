const baseUrl = require('./baseUrl');
const { default: getAuthHeader } = require('./getAuthHeader');

const addList = async (listName, value) => {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${baseUrl}/list`, {
    method: 'POST',
    body: JSON.stringify({ name: listName, loading: true, value }),
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.error(`Error adding list ${listName}: ${res.status}`);
    return null;
  }

  return await res.json(); // Parse and return the JSON response, assuming it includes the ID.
};

module.exports = addList;
