const getUserInfo = () => {
  const name = document.querySelector('h1').innerText;
  const headline = document.querySelector(
    '.text-body-medium.break-words'
  ).innerText;

  const profileImage = document
    .querySelector('.pv-top-card-profile-picture__container > img')
    .getAttribute('src');
  const urn = decodeURIComponent(
    document
      .querySelector('#navigation-index-see-all-companies')
      .getAttribute('href')
  )
    .split('fsd_profile:')[1]
    .split('&')[0];

  let company = 'Unknown';

  if (document.querySelector('#experience')) {
    const expString = document
      .querySelector('#experience')
      .parentElement.querySelector(
        'ul > li:nth-child(1) > div > div:nth-child(2) > div'
      )
      .innerText.split('\n');

    company = expString[0] + ' - ' + expString[2];
  }

  return { name, headline, profileImage, urn, company };
};

module.exports = getUserInfo;
