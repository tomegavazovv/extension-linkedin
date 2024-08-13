const documentBody = async () => {
  let counter = 0;
  let targetNode = null;

  async function getBodyElement() {
    while (counter < 30) {
      targetNode = document.body;
      if (targetNode !== null) {
        return targetNode; // Return as soon as the node is found
      }
      await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for 6000ms
      counter++;
    }
    console.log('Node not found');
    return null;
  }

  const bodyElement = await getBodyElement();

  return bodyElement;
};

export default documentBody;
