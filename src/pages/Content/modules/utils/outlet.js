const { default: getApplicationOutlet } = require('./getApplicationOutlet');

const outlet = async () => {
  const applicationOutlet = await getApplicationOutlet();

  const hideApplicationOutlet = () =>
    (applicationOutlet.style.display = 'none');
  const showApplicationOutlet = () => (applicationOutlet.style.display = '');

  return { hideApplicationOutlet, showApplicationOutlet, applicationOutlet };
};

export default outlet;
