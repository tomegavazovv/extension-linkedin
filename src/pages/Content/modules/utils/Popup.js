class Popup {
  constructor() {
    this.hostElement = document.createElement('div');
    this.hostElement.style.position = 'fixed';
    this.hostElement.style.opacity = '90%';
    this.hostElement.style.top = '10%';
    this.hostElement.style.left = '50%';
    this.hostElement.style.transform = 'translate(-50%, -50%)';
    this.hostElement.style.zIndex = '1000';
    this.hostElement.style.maxWidth = '550px';
    this.hostElement.style.padding = '20px 40px';
    this.hostElement.style.backgroundColor = 'white';
    this.hostElement.style.color = 'black';
    this.hostElement.style.fontWeight = '500';
    this.hostElement.style.borderRadius = '5px';
    this.hostElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    this.hostElement.style.textAlign = 'center';
    document.body.appendChild(this.hostElement);
    this.shadowRoot = this.hostElement.attachShadow({ mode: 'open' });
    this.statusElement = document.createElement('div');
    this.statusElement.style.fontSize = '17px'; // Larger font size
    this.shadowRoot.appendChild(this.statusElement);
  }

  renderText(text) {
    this.statusElement.textContent = text;
  }

  deletePopup() {
    document.body.removeChild(this.hostElement);
  }
}

export default Popup;
