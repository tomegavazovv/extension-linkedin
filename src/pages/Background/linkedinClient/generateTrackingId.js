module.exports = () => {
  const randomIntArray = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256)
  );
  const randByteArray = new Uint8Array(randomIntArray);
  const trackingId = btoa(String.fromCharCode.apply(null, randByteArray));
  return trackingId;
};
