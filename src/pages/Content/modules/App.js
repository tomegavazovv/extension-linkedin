import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

function App({ initUser = null }) {
  const [user, setUser] = useState(initUser);

  useEffect(() => {
    const handleData = (event) => {
      setUser(event.detail.userInfo);
      console.log(event.detail);
    };

    const handleProfileClosed = () => {
      setUser(null);
    };

    document.addEventListener('profileFetched', handleData);
    document.addEventListener('profileClosed', handleProfileClosed);

    return () => {
      document.removeEventListener('profileFetched', handleData);
      document.removeEventListener('profileClosed', handleProfileClosed);
    };
  }, []);

  return (
    <div>
      <Sidebar user={user} />
    </div>
  );
}

export default App;
