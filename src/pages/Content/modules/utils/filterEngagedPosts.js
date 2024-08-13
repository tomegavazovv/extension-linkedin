const filterEngagedPosts = (postsContainer) => {
  postsContainer
    .querySelectorAll(
      'span.reactions-react-button.feed-shared-social-action-bar__action-button > button:nth-child(1)'
    )
    .forEach((btn) => {
      if (btn.getAttribute('aria-pressed') === 'true') {
        const post = btn.closest('.feed-shared-update-v2');
        const elem = post.closest('li').querySelector('div');
        elem.style.setProperty('background-color', '#edf9ed', 'important');
        post.__engagedData = {
          engaged: true,
        };
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
    });
};

export default filterEngagedPosts;
