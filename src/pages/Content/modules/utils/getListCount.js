const getListCount = () => {
  const url = window.location.href;
  const urlParams = new URLSearchParams(new URL(url).search);
  const count = urlParams.get('c');
  return count;
};

export default getListCount;
