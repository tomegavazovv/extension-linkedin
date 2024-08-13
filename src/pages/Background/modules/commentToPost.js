const { createHeadersForComment } = require('../linkedinClient/createHeaders');
const baseUrl = require('./baseUrl');
const { default: getAuthHeader } = require('./getAuthHeader');

async function commentToPost(urn, comment) {
  const headers = await createHeadersForComment();
  const authHeader = await getAuthHeader();

  const res = await fetch(
    'https://www.linkedin.com/voyager/api/voyagerSocialDashNormComments?decorationId=com.linkedin.voyager.dash.deco.social.NormComment-43',
    {
      headers: headers,
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: JSON.stringify({
        commentary: {
          text: comment,
          attributesV2: [],
          $type: 'com.linkedin.voyager.dash.common.text.TextViewModel',
        },
        threadUrn: urn,
      }),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    }
  );

  await fetch(`${baseUrl}/posts/${urn}/comment`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment: comment,
    }),
  });

  return res.status;
}

module.exports = commentToPost;
