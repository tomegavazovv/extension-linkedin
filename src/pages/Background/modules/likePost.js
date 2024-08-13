const { createHeadersForLike } = require('../linkedinClient/createHeaders');
const baseUrl = require('./baseUrl');

async function likePost(url, listId) {
  // const headers = await createHeadersForLike();
  // // const authHeader =
  // //   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MjEzNTE3NmIyNjIxOGNlZTk5MzQzZCIsImlhdCI6MTcxMzQ3MDIyMCwiZXhwIjoxNzIxMjQ2MjIwfQ.mv6s6d8ac0C1FsNmieEZWDmOcP9Q4PUr1VXoCfa7AIk';

  // // const res = await fetch(
  // //   `https://www.linkedin.com/voyager/api/voyagerSocialDashReactions?threadUrn=${urn}`,
  // //   {
  // //     headers: headers,
  // //     referrerPolicy: 'strict-origin-when-cross-origin',
  // //     body: JSON.stringify({ reactionType }),
  // //     method: 'POST',
  // //     mode: 'cors',
  // //     credentials: 'include',
  // //   }
  // // );
  // // const decodedUrn = decodeURIComponent(urn);
  const tokenObject = await chrome.storage.local.get('token');
  const token = tokenObject.token;

  const decodedUrn = decodeURIComponent(url).split('threadUrn=')[1];
  await fetch(`${baseUrl}/posts/${decodedUrn}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

module.exports = likePost;
