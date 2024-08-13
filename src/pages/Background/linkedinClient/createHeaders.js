const generateTrackingId = require('./generateTrackingId');
const getCookiesAndCsrf = require('./getCookiesAndCsrf');

const BASE_REQUEST_HEADERS = {
  'user-agent': navigator.userAgent,
  accept: 'application/vnd.linkedin.normalized+json+2.1',
  'accept-language': 'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
  'accept-encoding': 'gzip, deflate, br, zstd',
  'x-restli-protocol-version': '2.0.0',
  'x-li-track':
    '{"clientVersion":"1.13.14791","osName":"web","timezoneOffset":2,"deviceFormFactor":"DESKTOP","mpName":"voyager-web"}',
};

async function createLinkedinBaseHeaders() {
  const { csrfToken, cookieHeader } = await getCookiesAndCsrf(
    'https://www.linkedin.com/'
  );
  return {
    Cookie: cookieHeader,
    'Csrf-Token': csrfToken,
    ...BASE_REQUEST_HEADERS,
  };
}

async function createHeadersForGetProfile() {
  const baseHeaders = await createLinkedinBaseHeaders();
  return {
    ...baseHeaders,
  };
}

async function createHeadersForGetReactions() {
  const baseHeaders = await createLinkedinBaseHeaders();
  return {
    ...baseHeaders,
  };
}

async function createHeadersForComment() {
  const baseHeaders = await createLinkedinBaseHeaders();
  return {
    ...baseHeaders,
    'x-li-pem-metadata': 'Voyager - Feed - Comments=create-a-comment',
    'x-li-page-instance': `urn:li:page:d_flagship3_profile_view_base_recent_activity_content_view;${generateTrackingId()}`,
    'x-li-lang': 'en_US',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'cache-control': 'no-cache',
  };
}

async function createHeadersForLike() {
  const baseHeaders = await createLinkedinBaseHeaders();
  return {
    ...baseHeaders,
    'x-li-page-instance': `urn:li:page:d_flagship3_feed;${generateTrackingId()};`,
    'x-li-lang': 'en_US',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'cache-control': 'no-cache',
  };
}

async function createHeadersForSearch(trackingId) {
  const baseHeaders = await createLinkedinBaseHeaders();
  return {
    ...baseHeaders,
    'x-li-page-instance': `urn:li:page:d_flagship3_feed;${trackingId};`,
    'x-li-pem-metadata':
      'Voyager - Search Typeahead Page=global-search-typeahead-result',
    'x-li-lang': 'en_US',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'cache-control': 'no-cache',
    referer: 'https://www.linkedin.com/feed/',
  };
}

exports.createHeadersForGetProfile = createHeadersForGetProfile;
exports.createHeadersForComment = createHeadersForComment;
exports.createHeadersForLike = createHeadersForLike;
exports.createHeadersForGetReactions = createHeadersForGetReactions;
exports.createHeadersForSearch = createHeadersForSearch;
