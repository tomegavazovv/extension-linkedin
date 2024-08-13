const getCookies = require('./getCookies');

const BASE_REQUEST_HEADERS = {
  'user-agent': navigator.userAgent,
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-language': 'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
  'accept-encoding': 'gzip, deflate, br, zstd',
};

async function createHeaders() {
  const { cookieHeader } = await getCookies('https://app.useaware.co/');
  return {
    Cookie: cookieHeader,
    ...BASE_REQUEST_HEADERS,
  };
}

module.exports = createHeaders;
