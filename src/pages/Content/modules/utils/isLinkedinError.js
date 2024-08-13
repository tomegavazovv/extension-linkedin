const isLinkedinError = () => {
  const isLinkedinError = Array.from(document.querySelectorAll('h1')).some(
    (h1) =>
      h1.textContent.includes('This one’s our fault. We’re looking into it.')
  );

  return isLinkedinError;
};

export default isLinkedinError;
