const { createHeadersForSearch } = require('../linkedinClient/createHeaders');

function safeGet(obj, path) {
  const pathArray = path.replace(/\[(\w+)\]/g, '.$1').split('.'); // Convert indices to properties
  return pathArray.reduce((current, key) => {
    // Check if current is an object (which includes arrays, but excludes null)
    return current !== null && typeof current === 'object' && key in current
      ? current[key]
      : undefined;
  }, obj);
}

async function searchUser(query, trackingId) {
  try {
    const headers = await createHeadersForSearch(trackingId);

    const url = `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(query:${query})&queryId=voyagerSearchDashTypeahead.12b4a71a2090ef484848a94986899aaa`;

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    const data = await response.json();
    console.log(data);
    const elements = data['data']['data'][
      'searchDashTypeaheadByGlobalTypeahead'
    ]['elements']
      .slice(0, 4)
      .filter(
        (el) =>
          el['suggestionType'] === 'ENTITY_HISTORY_TYPEAHEAD' ||
          el['suggestionType'] === 'ENTITY_TYPEAHEAD'
      );
    const included = data['included'];
    const results = [];
    for (let i = 0; i < elements.length; i++) {
      const profileImage =
        safeGet(
          elements[i],
          'entityLockupView.image.attributes[0].detailData.nonEntityProfilePicture.vectorImage.artifacts[0].fileIdentifyingUrlPathSegment'
        ) || '';
      const companyImage =
        safeGet(
          elements[i],
          'entityLockupView.image.attributes[0].detailData.nonEntityCompanyLogo.vectorImage.artifacts[0].fileIdentifyingUrlPathSegment'
        ) || '';
      const headline =
        safeGet(elements[i], 'entityLockupView.subtitle.text') || '';
      const title = safeGet(elements[i], 'entityLockupView.title.text') || '';
      const urnProfile = safeGet(
        elements[i],
        'entityLockupView.image.attributes[0].detailData.nonEntityProfilePicture.*profile'
      );
      const urnCompany = safeGet(
        elements[i],
        'entityLockupView.image.attributes[0].detailData.nonEntityCompanyLogo.*profile'
      );
      const info = { profileImage, companyImage, headline, title };
      const urn = urnProfile ? urnProfile : urnCompany;
      const result = {
        element: info,
        urn: urn,
      };
      results.push(result);
    }

    return results;
  } catch (error) {
    console.error('Error fetching profile reactions:', error);
  }
}

module.exports = searchUser;
