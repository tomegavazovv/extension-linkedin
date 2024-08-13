const createHeaders = require('./createHeaders');

const checkAware = async () => {
  const headers = await createHeaders();
  const response = await fetch(`https://app.useaware.co/`, {
    headers,
    method: 'GET',
    credentials: 'include',
  });
  return response.status >= 200 && response.status < 300;
};

module.exports = checkAware;
