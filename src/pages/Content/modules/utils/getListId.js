const getListId = () => {
  const url = window.location.href;
  const urlParams = new URLSearchParams(new URL(url).search);
  const listId = urlParams.get('browser');
  return listId;
};

export default getListId;
