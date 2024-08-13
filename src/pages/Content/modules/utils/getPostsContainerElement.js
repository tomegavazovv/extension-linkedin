import getListCount from './getListCount';
import isLinkedinError from './isLinkedinError';

const noPostsFound = (postsContainer) => {
  return !!document.querySelector('.search-reusable-search-no-results');
};

const getPostsContainerElement = async (popup) => {
  let counter = 0;
  let targetNode = null;

  popup.renderText('Loading posts...');
  async function getPostsContainer() {
    while (counter < 10) {
      targetNode = document.querySelector('.scaffold-finite-scroll__content');
      if (targetNode !== null) {
        return targetNode;
      }
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log('Checking again...');
      counter++;
    }
    return null;
  }

  const postsContainer = await getPostsContainer();

  if (targetNode) {
    if (noPostsFound(postsContainer)) {
      const count = getListCount();

      const elem = document.querySelector(
        'section.artdeco-empty-state'
      ).nextElementSibling;
      elem.classList.add('hidden');
      const p = document.querySelector('section.artdeco-empty-state > p');
      p.classList.add('hidden');
      setTimeout(() => {
        popup.deletePopup();
      }, 7000);
      if (count > 28) {
        popup.renderText(
          'This may be a LinkedIn error if you have more than 28 users in your list.'
        );
      } else {
        popup.renderText('No new posts here :)');

        setTimeout(() => {
          popup.deletePopup();
        }, 4000);
      }
    } else {
      popup.deletePopup();
    }
  } else {
    if (isLinkedinError()) {
      popup.renderText(
        'Keep your lists < 28 users. This is a LinkedIn error and there is nothing we can do about it :/'
      );
      setTimeout(() => {
        popup.deletePopup();
      }, 12000);
    } else {
      popup.renderText(
        'An unknown error occured :/ Reload the page and try again.'
      );

      setTimeout(() => {
        popup.deletePopup();
      }, 10000);
    }
  }
  return postsContainer;
};

export default getPostsContainerElement;
