import { markIfCommentedPost } from './markCommentedPosts';

const likeToProfile = require('../../../Background/modules/likeToProfile');
const { addSkipButton } = require('./addSkipButtons');
const { enrichReactButton } = require('./enrichReactButtons');
const { hideIfSkipped } = require('./filterSkippedPosts');
const { default: getListId } = require('./getListId');
const { default: isPostEngaged } = require('./isPostEngaged');

const nodeIsPost = (node) => node.classList.contains('feed-shared-update-v2');
const nodeIsEmptyLike = (node) =>
  node.matches('[data-test-icon="thumbs-up-outline-medium"]');

const callback = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (nodeIsPost(node)) {
            const commented = markIfCommentedPost(node);

            if (!commented && isPostEngaged(node)) {
              node.__engagedData = {
                engaged: true,
              };
              const post = node.closest('li').querySelector('div');
              post.style.setProperty(
                'background-color',
                '#edf9ed',
                'important'
              );

              const seeMoreBtn = post.querySelector(
                '.feed-shared-inline-show-more-text__see-more-less-toggle'
              );
              if (seeMoreBtn) {
                seeMoreBtn.style.setProperty(
                  'background-color',
                  '#edf9ed',
                  'important'
                );
              }
            }
            // }
          } else if (nodeIsEmptyLike(node)) {
            enrichReactButton(node);
          } else if (
            node.classList.contains(
              'feed-shared-inline-show-more-text__see-more-less-toggle'
            )
          ) {
            const engaged = node.closest(
              '.feed-shared-update-v2'
            ).__engagedData;

            if (engaged) {
              node.style.setProperty(
                'background-color',
                '#edf9ed',
                'important'
              );
            }
          }
        }
      });
    } else if (
      mutation.type === 'childList' &&
      mutation.removedNodes.length > 0
    ) {
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (nodeIsEmptyLike(node)) {
            const { profileUrn, postUrn, postId } = node.__parentData;

            const post = document.querySelector(`#${postId}`);
            post.parentElement.parentElement.parentElement.style.setProperty(
              'background-color',
              '#edf9ed',
              'important'
            );

            const seeMoreBtn = post.querySelector(
              '.feed-shared-inline-show-more-text__see-more-less-toggle'
            );

            if (seeMoreBtn) {
              seeMoreBtn.style.setProperty(
                'background-color',
                '#edf9ed',
                'important'
              );
            }

            likeToProfile(getListId(), profileUrn, postUrn).then(() => {});
          }
        }
      });
    }
  }
};

const setupObserver = (postsContainer) => {
  const config = {
    childList: true,
    subtree: true,
  };

  const observer = new MutationObserver(callback);

  observer.observe(postsContainer, config);
};

export default setupObserver;
