const {
  createHeadersForGetReactions,
} = require('../linkedinClient/createHeaders');

async function getProfileReactions(urn) {
  try {
    const headers = await createHeadersForGetReactions();
    const params = new URLSearchParams({
      count: 20,
      start: 0,
      q: 'memberReactions',
      moduleKey: 'member-shares:phone',
      includeLongTermHistory: true,
      profileUrn: `urn:li:fsd_profile:${urn}`,
    });

    const url = `https://www.linkedin.com/voyager/api/identity/profileUpdatesV2?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    const data = await response.json();
    const elements = data['data']['*elements'].map((el) =>
      el
        .replace('urn:li:fs_updateV2:(', '')
        .replace(',PROFILE_REACTIONS,EMPTY,DEFAULT,false)', '')
    );
    return elements;
  } catch (error) {
    console.error('Error fetching profile reactions:', error);
  }
}

module.exports = getProfileReactions;
