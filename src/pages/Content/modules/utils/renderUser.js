const getUserInfo = require('./getUserInfo');

const renderUser = () => {
  const profileObserver = new MutationObserver((mutations, obs) => {
    const essentialPresent =
      document.querySelector('h1') &&
      document.querySelector('.text-body-medium.break-words') &&
      document.querySelector('.pv-top-card-profile-picture__container > img') &&
      document.querySelector('#navigation-index-see-all-companies');

    const experienceOrEducationPresent =
      document.querySelector('#experience') ||
      document.querySelector('#education');

    if (essentialPresent && experienceOrEducationPresent) {
      const userInfo = getUserInfo();
      document.dispatchEvent(
        new CustomEvent('profileFetched', { detail: { userInfo } })
      );

      clearTimeout(timeout);
      obs.disconnect();
    }
  });

  profileObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  const timeout = setTimeout(() => {
    console.log('Timeout reached without finding all elements.');
    profileObserver.disconnect();
  }, 8000);
};

module.exports = renderUser;
