import skipPost from '../Background/modules/skipPost';
import commentToProfile from '../Background/modules/commentToProfile';
import renderSidebar from './modules/utils/renderSidebar';
import getPostsContainerElement from './modules/utils/getPostsContainerElement';
import { filterSkippedPosts } from './modules/utils/filterSkippedPosts';
import { addSkipButtons } from './modules/utils/addSkipButtons';
import filterEngagedPosts from './modules/utils/filterEngagedPosts';
import { enrichReactButtons } from './modules/utils/enrichReactButtons';
import getListId from './modules/utils/getListId';
import setupObserver from './modules/utils/setupObserver';
import stylePostsContainer from './modules/utils/stylePostsContainer';
import outlet from './modules/utils/outlet';
import isLinkedinError from './modules/utils/isLinkedinError';
import documentBody from './modules/utils/documentBody';
import Popup from './modules/utils/Popup';
import { markIfCommentedPosts } from './modules/utils/markCommentedPosts';

const isLinkedinOpen = () => window.location.href.includes('linkedin');
const isListOpen = () =>
  window.location.href.includes('/search/results/content') &&
  window.location.href.includes('browser=');

if (isLinkedinOpen()) {
  (async () => {
    if (isListOpen()) {
      const body = await documentBody();
      body.style.display = 'none';
      body.style.backgroundColor = '#F4F2EE';
    }
  })();

  document.addEventListener('DOMContentLoaded', async () => {
    if (!isListOpen()) {
      renderSidebar();
    }

    if (isListOpen()) {
      const popup = new Popup();
      try {
        document.body.style.display = 'none';
        document.documentElement.style.display = '';
        document.body.style.backgroundColor = '#F4F2EE';

        renderSidebar();

        const {
          applicationOutlet,
          hideApplicationOutlet,
          showApplicationOutlet,
        } = await outlet();

        if (applicationOutlet) {
          hideApplicationOutlet();
          try {
            document.querySelector('.scaffold-layout-toolbar').style.display =
              'none';
          } catch (er) {}
          document.body.style.display = '';
          const postsContainer = await getPostsContainerElement(popup);

          if (postsContainer && getListId()) {
            // await filterSkippedPosts(postsContainer);
            await markIfCommentedPosts(postsContainer);
            enrichReactButtons(postsContainer);
            setupObserver(postsContainer);
            filterEngagedPosts(postsContainer);
            stylePostsContainer();
            showApplicationOutlet();
            document.body.style.display = '';
            // addSkipButtons(postsContainer);
          } else {
            throw new Error();
          }
        } else {
          throw new Error();
        }
      } catch (err) {
        console.log('ERROR:');
        console.log(err);
        if (!isLinkedinError()) {
          popup.renderText(
            'An unknown error occured :/ Reload the page and try again.'
          );

          setTimeout(() => {
            popup.deletePopup();
          }, 10000);
        }
      } finally {
        if (isLinkedinError()) {
          document.querySelector('.application-outlet').style.display = '';
          document.body.style.display = '';
          if (!isLinkedinError()) {
            popup.renderText(
              'Please keep yours lists < 25 people. This is a LinkedIn error and there is nothing we can do about it :/'
            );

            setTimeout(() => {
              popup.deletePopup();
            }, 10000);
          }
        }
      }
    }
  });
}

const generateTrackingId = require('../Background/linkedinClient/generateTrackingId');
const trackingId = generateTrackingId();

window.addEventListener('likeSubmitted', function (e) {
  chrome.runtime.sendMessage(
    { type: 'likeSubmitted', value: e.detail },
    function (response) {
      console.log('Response from background: ', response);
    }
  );
});

window.addEventListener('commentSubmitted', function (e) {
  console.log('commentSent');
  chrome.runtime.sendMessage(
    { type: 'commentSubmitted', value: e.detail },
    function (response) {
      console.log('Response from background: ', response);
    }
  );
});

window.addEventListener('inputSubmitted', function (e) {
  chrome.runtime.sendMessage(
    { type: 'inputSubmitted', value: e.detail },
    function (response) {
      window.postMessage(
        { type: 'FROM_EXTENSION_PROFILE_INFO', payload: response },
        '*'
      );
    }
  );
});

window.addEventListener('searchUser', function (e) {
  chrome.runtime.sendMessage(
    { type: 'searchUser', value: { ...e.detail, trackingId } },
    function (response) {
      window.postMessage({ type: 'FROM_EXTENSION', payload: response }, '*');
    }
  );
});

window.addEventListener('addByUrn', function (e) {
  chrome.runtime.sendMessage(
    { type: 'addByUrn', value: { ...e.detail } },
    function (response) {
      window.postMessage(
        { type: 'FROM_EXTENSION_PROFILE_INFO', payload: response },
        '*'
      );
    }
  );
});

window.addEventListener('csvUploaded', function (e) {
  chrome.runtime.sendMessage(
    { type: 'csvUploaded', value: { ...e.detail } },
    function (response) {
      console.log('Response from background: ', response);
    }
  );
});

window.addEventListener('getCsvUploadingLists', function (e) {
  chrome.runtime.sendMessage(
    { type: 'getCsvUploadingLists', value: { ...e.detail } },
    function (response) {
      console.log('Resposne from background: ', response);
      window.postMessage(
        { type: 'FROM_EXTENSION_LISTS_CSV_UPLOADING', payload: response },
        '*'
      );
    }
  );
});

window.addEventListener('isCsvUploading', function (e) {
  chrome.runtime.sendMessage(
    { type: 'isCsvUploading', value: { ...e.detail } },
    function (response) {
      console.log('Resposne from background: ', response);
      window.postMessage(
        { type: 'FROM_EXTENSION_IS_CSV_UPLOADING', payload: response },
        '*'
      );
    }
  );
});

window.addEventListener('isAwareUploading', function (e) {
  chrome.runtime.sendMessage(
    { type: 'isAwareUploading', value: { ...e.detail } },
    function (response) {
      console.log('Resposne from background: ', response);
      window.postMessage(
        { type: 'FROM_EXTENSION_IS_AWARE_UPLOADING', payload: response },
        '*'
      );
    }
  );
});

window.addEventListener('getAwareLists', function (e) {
  chrome.runtime.sendMessage(
    { type: 'getAwareLists', value: { ...e.detail } },
    function (response) {
      window.postMessage(
        { type: 'FROM_EXTENSION_AWARE_LISTS', payload: response },
        '*'
      );
    }
  );
});

window.addEventListener('syncAwareLists', function (e) {
  chrome.runtime.sendMessage(
    { type: 'syncAwareLists', value: { ...e.detail } },
    function (response) {
      window.postMessage(
        { type: 'FROM_EXTENSION_REFRESH_LISTS', payload: response },
        '*'
      );
    }
  );
});

window.addEventListener('removedAwareList', function (e) {
  chrome.runtime.sendMessage({
    type: 'removedAwareList',
    value: { ...e.detail },
  });
});

window.addEventListener('removedCsvList', function (e) {
  chrome.runtime.sendMessage({
    type: 'removedCsvList',
    value: { ...e.detail },
  });
});

window.addEventListener('isExtensionInstalled', function (e) {
  window.postMessage({ type: 'FROM_EXTENSION' }, '*');
});

window.addEventListener('checkAware', function (e) {
  chrome.runtime.sendMessage({ type: 'checkAware' }, function (response) {
    window.postMessage(
      { type: 'FROM_EXTENSION_AWARE', payload: response },
      '*'
    );
  });
});

window.addEventListener('userLoggedIn', function (e) {
  chrome.runtime.sendMessage({ type: 'userLoggedIn', value: { ...e.detail } });
});

window.addEventListener('userLoggedOut', function (e) {
  chrome.runtime.sendMessage({ type: 'userLoggedOut', value: { ...e.detail } });
});

document.addEventListener('click', function (event) {
  const urlParams = new URLSearchParams(window.location.search);
  const listId = urlParams.get('browser');

  if (!listId) return; // Exit early if no listId found

  function extractProfileUrn(elem) {
    const link = elem.querySelector('.update-components-actor__container > a');

    return link
      ? decodeURIComponent(link.getAttribute('href')).split('miniProfile:')[1]
      : null;
  }

  // Find the nearest parent post or element with the required data
  function findParentElement(target, className) {
    return target.closest(className);
  }

  if (event.target.matches('.skip-button')) {
    const post = findParentElement(event.target, '.feed-shared-update-v2'); // Assuming '.feed-shared-update-v2' is a common class up the hierarchy
    const urn = post.getAttribute('data-urn');
    skipPost(listId, urn).then(() => {});
    post.style.display = 'none';
  } else if (
    event.target.matches(
      '.comments-comment-box__submit-button, .artdeco-button__text'
    ) &&
    event.target.closest('.comments-comment-box__submit-button')
  ) {
    const element = findParentElement(event.target, '.feed-shared-update-v2'); // Adjust the class as needed
    const profileUrn = extractProfileUrn(element);
    if (profileUrn) {
      element.parentElement.parentElement.parentElement.style.setProperty(
        'background-color',
        '#edf9ed',
        'important'
      );

      const seeMoreBtn = element.querySelector(
        '.feed-shared-inline-show-more-text__see-more-less-toggle'
      );

      if (seeMoreBtn) {
        seeMoreBtn.style.setProperty(
          'background-color',
          '#edf9ed',
          'important'
        );
      }

      const postUrn = element.getAttribute('data-urn');
      commentToProfile(listId, profileUrn, postUrn).then(() => {});
    }
  }
});
