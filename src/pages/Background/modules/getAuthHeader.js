const getAuthHeader = async () => {
  const tokenObject = await chrome.storage.local.get('token');
  const token = tokenObject.token;

  return `Bearer ${token}`;
};

export default getAuthHeader;
