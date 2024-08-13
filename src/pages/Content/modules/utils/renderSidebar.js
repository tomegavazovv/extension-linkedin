import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import renderUser from './renderUser';
import styling from './styling';

const renderSidebar = () => {
  const style = document.createElement('style');
  style.textContent = styling;
  const shadowHost = document.createElement('div');
  const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
  shadowRoot.appendChild(style);
  const reactRoot = document.createElement('div');
  shadowRoot.appendChild(reactRoot);
  document.body.insertBefore(shadowHost, document.body.firstChild);
  let user = null;
  if (window.location.href.startsWith('https://www.linkedin.com/in/')) {
    user = window.location.href;
  }
  ReactDOM.render(<App initUser={user} />, reactRoot);
  renderUser();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'profileOpened') {
      const event = new CustomEvent('profileOpened', {
        detail: { profile: 'profile' },
      });
      renderUser();

      document.dispatchEvent(event);
    } else if (request.message === 'profileClosed') {
      const event = new CustomEvent('profileClosed');
      document.dispatchEvent(event);
    }
  });
};

export default renderSidebar;
