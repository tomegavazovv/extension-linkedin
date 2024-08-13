const enrichReactButtons = (postsContainer) => {
  postsContainer
    .querySelectorAll('[data-test-icon="thumbs-up-outline-medium"]')
    .forEach((node) => {
      const element = node.closest('.feed-shared-update-v2');
      if (element) {
        const profileUrnSplitted = decodeURIComponent(
          element
            .querySelector('.update-components-actor__container > a')
            .getAttribute('href')
        ).split(':');

        const profileUrn = profileUrnSplitted[profileUrnSplitted.length - 1];

        const postUrn = element.getAttribute('data-urn');
        console.log(profileUrn);
        if (profileUrn) {
          node.__parentData = {
            profileUrn,
            postUrn,
            postId: element.getAttribute('id'),
          };
        }
      }
    });
};

const enrichReactButton = (post) => {
  const element = post.closest('.feed-shared-update-v2');
  const postUrn = element.getAttribute('data-urn');
  const profileUrnSplitted = decodeURIComponent(
    element
      .querySelector('.update-components-actor__container > a')
      .getAttribute('href')
  ).split(':');

  const profileUrn = profileUrnSplitted[profileUrnSplitted.length - 1];
  console.log('button' + ' - ' + profileUrn);
  if (profileUrn) {
    post.__parentData = {
      profileUrn,
      postUrn,
      postId: element.getAttribute('id'),
    };
  }
};

export { enrichReactButtons, enrichReactButton };
