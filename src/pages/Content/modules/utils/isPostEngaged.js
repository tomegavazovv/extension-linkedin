const isPostEngaged = (post) => {
  return (
    post
      .querySelector(
        'span.reactions-react-button.feed-shared-social-action-bar__action-button > button:nth-child(1)'
      )
      .getAttribute('aria-pressed') === 'true'
  );
};

export default isPostEngaged;
