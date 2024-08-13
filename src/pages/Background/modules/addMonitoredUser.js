const {
  createHeadersForGetReactions,
  createHeadersForGetProfile,
} = require('../linkedinClient/createHeaders');
const baseUrl = require('./baseUrl');
const { default: getAuthHeader } = require('./getAuthHeader');

function randomDelay() {
  const min = 1500; // Minimum time in milliseconds (1.5 seconds)
  const max = 3000; // Maximum time in milliseconds (3 seconds)
  const delayTime = Math.random() * (max - min) + min; // Generate a random delay
  return new Promise((resolve) => setTimeout(resolve, delayTime));
}

async function getProfile({ publicId = '', urn = '' }) {
  let param = publicId !== '' ? publicId : urn;
  try {
    const headers = await createHeadersForGetProfile();
    const url = `https://www.linkedin.com/voyager/api/identity/profiles/${param}/profileView`;

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    const data = await response.json();
    const miniProfile = data['included'].find((item) => item['*miniProfile']);
    const imageObject = data['included'].find(
      (item) => item['publicIdentifier']
    )['picture'];

    const firstName = miniProfile['firstName'];
    const lastName = miniProfile['lastName'];
    const headline = miniProfile['headline'];
    const urn = miniProfile['entityUrn'].replace('urn:li:fs_profile:', '');
    let image = '';
    if (imageObject !== null) {
      image =
        imageObject.rootUrl +
        imageObject.artifacts[2].fileIdentifyingUrlPathSegment;
    }

    const companyObject = data['included'].find(
      (item) => item['dashCompanyUrn']
    );
    let company = 'Unknown';
    if (companyObject) {
      company = companyObject['name'];
    }

    return { firstName, lastName, headline, urn, image, company };
  } catch (error) {
    console.error('Error retrieving profile data:', error);
    return null;
  }
}

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

async function addMonitoredUser({ listId, publicId = '', urnId = '' }) {
  try {
    // Fetch profile details
    const { firstName, lastName, headline, urn, image, company } =
      await getProfile({
        publicId,
        urn: urnId,
      });

    // Prepare the data to be sent
    const body = JSON.stringify({
      name: firstName + ' ' + lastName,
      headline: headline,
      profileImage: image,
      urn: urn,
      publicId,
      company,
    });

    const authHeader = await getAuthHeader();

    // Send the data via POST request
    const res = await fetch(`${baseUrl}/list/${listId}/add`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (res.ok) {
      const data = await res.json();

      const id = data['data']['id'];

      return {
        firstName,
        lastName,
        headline,
        image,
        urn,
        company,
        id,
        publicId,
      };
    } else {
      const data = await res.json();
      if (data['hours']) {
        console.log('hours');
        throw new Error(`Limit [${data['hours']}]`);
      } else {
        throw new Error('An unknown error occured');
      }
    }
  } catch (err) {
    throw err;
  }
}

module.exports = addMonitoredUser;
