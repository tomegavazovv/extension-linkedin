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

const filterSkippedPosts = async (postsContainer) => {
  const skipped = await getSkipped();

  postsContainer.querySelectorAll('.feed-shared-update-v2').forEach((post) => {
    if (skipped[post.getAttribute('data-urn')]) {
      post.parentElement.parentElement.parentElement.style.display = 'none';
    }
  });
};

const hideIfSkipped = (post) => {
  const skipped = skippedPosts;
  if (skipped[post.getAttribute('data-urn')]) {
    post.parentElement.parentElement.parentElement.style.display = 'none';
    return true;
  }
};

export { filterSkippedPosts, hideIfSkipped };
