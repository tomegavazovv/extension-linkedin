import getSkippedPosts from '../../../Background/modules/getSkippedPosts';
import getListId from './getListId';

let skippedPosts = {};

const getSkipped = async () => {
  if (Object.keys(skippedPosts).length > 0) {
    return skippedPosts;
  } else {
    const res = await getSkippedPosts(getListId());
    const data = await res.json();
    const posts = data['data'];
    posts.forEach((postId) => {
      skippedPosts[postId] = true;
    });
    return skippedPosts;
  }
};

const markCommented = (post) => {
  const element = post.parentElement.parentElement.parentElement;
  element.style.setProperty('background-color', '#edf9ed', 'important');

  const seeMoreBtn = element.querySelector(
    '.feed-shared-inline-show-more-text__see-more-less-toggle'
  );

  if (seeMoreBtn) {
    seeMoreBtn.style.setProperty('background-color', '#edf9ed', 'important');
  }
};

const markIfCommentedPosts = async (postsContainer) => {
  const skipped = await getSkipped();

  postsContainer.querySelectorAll('.feed-shared-update-v2').forEach((post) => {
    if (skipped[post.getAttribute('data-urn')]) {
      markCommented(post);
    }
  });
};

const markIfCommentedPost = (post) => {
  const skipped = skippedPosts;
  if (skipped[post.getAttribute('data-urn')]) {
    markCommented(post);
    return true;
  }
  return false;
};

export { markIfCommentedPosts, markIfCommentedPost };
