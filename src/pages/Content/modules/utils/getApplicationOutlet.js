const getApplicationOutlet = async () => {
  let counter = 0;
  let targetNode = null;

  async function getOutlet() {
    while (counter < 25) {
      targetNode = document.querySelector('.application-outlet');
      if (targetNode !== null) {
        return targetNode; // Return as soon as the node is found
      }
      await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for 6000ms
      counter++;
    }
    console.log('Node not found'); // Log the failure
    return null;
  }

  const appOutlet = await getOutlet();

  return appOutlet;
};

export default getApplicationOutlet;
