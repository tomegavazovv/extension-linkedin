async function getCookies(url) {
  try {
    const cookies = await new Promise((resolve, reject) => {
      chrome.cookies.getAll({ url }, function (cookies) {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError));
        } else {
          resolve(cookies);
        }
      });
    });

    const cookieHeader = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');

    return { cookieHeader };
  } catch (error) {
    console.error('Error retrieving cookies:', error);
    throw error; // Rethrow to handle further up the chain
  }
}

module.exports = getCookies;
