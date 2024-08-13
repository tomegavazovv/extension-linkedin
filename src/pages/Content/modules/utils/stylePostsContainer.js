const stylePostsContainer = () => {
  const resultsContainer = document.querySelector('.search-results-container');
  const container = document.querySelector('.scaffold-layout__content');
  const toolbar = document.querySelector('.scaffold-layout-toolbar');

  if (resultsContainer) resultsContainer.style.width = '650px';
  if (container) {
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
  }
  if (toolbar) toolbar.style.display = 'none';
};

export default stylePostsContainer;
