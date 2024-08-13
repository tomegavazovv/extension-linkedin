const addSkipButtons = (postsContainer) => {
  postsContainer
    .querySelectorAll('.follow')
    .forEach((btn) => (btn.style.display = 'none'));
  postsContainer
    .querySelectorAll('.feed-shared-control-menu__content')
    .forEach(
      (btn) =>
        (btn.parentElement.innerHTML = "<span class='skip-button'>X</span>")
    );
};

const addSkipButton = (node) => {
  node
    .querySelectorAll('.follow')
    .forEach((btn) => (btn.style.display = 'none'));
  node
    .querySelectorAll('.feed-shared-control-menu__content')
    .forEach(
      (btn) =>
        (btn.parentElement.innerHTML = "<span class='skip-button'>X</span>")
    );
};

export { addSkipButtons, addSkipButton };
