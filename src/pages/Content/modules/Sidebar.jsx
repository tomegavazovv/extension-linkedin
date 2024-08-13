import React, { useEffect, useRef, useState } from 'react';
import getLists from '../../Background/modules/getLists';
import { Loader } from './Loader';
import getListUrl from '../../Background/modules/getListUrl';
import addUserToList from '../../Background/modules/addUserToList';

import checkIfMonitored from '../../Background/modules/checkIfMonitored';

const Sidebar = ({ user = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedList, setSelectedList] = useState();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAddList, setSelectedAddList] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const [lists, setLists] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [alreadyMonitored, setAlreadyMonitored] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(true);
  const [addErrorMessage, setAddErrorMessage] = useState('');
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const toggleSidebar = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      const { token } = await chrome.storage.local.get('token');
      if (!token)
        window.location.href = 'https://dexra.co/login?extension=true';
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mouseup', checkIfClickedOutside);
    }

    // Cleanup the event listener when the dropdown is closed or the component is unmounted
    return () => {
      document.removeEventListener('mouseup', checkIfClickedOutside);
    };
  }, [showDropdown]);

  const getUserPublicId = () => {
    const url = window.location.href;
    const items = url.split('/');
    const index = items.findIndex((item) => item === 'in');
    return items[index + 1];
  };

  const handleAddUserToList = (e) => {
    const publicId = getUserPublicId();
    setShowDropdown(false);
    setButtonLoading(true);
    addUserToList({ ...user, publicId }, selectedAddList)
      .then((res) => {
        if (!res.ok) {
          res.json().then((data) => {
            console.log(data);
            if (data['hours']) {
              const hours = data['hours'];
              setButtonLoading(false);
              setSelectedAddList(null);
              setAddErrorMessage(
                `You passed the limit of 80 added users per day. Try again in ${hours} hours :)`
              );
              console.log(hours);
            }
          });
        } else {
          console.log(res);
          setButtonLoading(false);
          setSelectedAddList(null);
          setAlreadyMonitored(true);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setButtonLoading(false);
        setSelectedAddList(null);
      });
  };

  const initialize = async () => {
    const url = window.location.href;
    const urlParams = new URLSearchParams(new URL(url).search);
    const listId = urlParams.get('browser');
    const date = urlParams.get('datePosted');
    const lists = await getLists();

    if (listId) {
      setLists(lists);
      setSelectedList(listId);
      setSelectedDate(date.replace(/"/g, ''));
      setIsOpen(true);
    }
  };

  useEffect(() => {
    setSelectedDate('past-24h');
    initialize().then(() => {});
  }, []);

  useEffect(() => {
    setButtonLoading(true);
    if (user) {
      checkIfMonitored(getUserPublicId()).then((data) => {
        setButtonLoading(false);
        const { exists } = data;
        if (exists === true) setAlreadyMonitored(true);
        else setAlreadyMonitored(false);
      });
    }
  }, [user]);

  const handleSelectChange = (event) => {
    setSelectedList(event.target.value === 'default' ? '' : event.target.value);
  };

  const handleSelectAddListChange = (event) => {
    setSelectedAddList(
      event.target.value === 'default' ? '' : event.target.value
    );
  };

  const handleRadioChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleManageListsClick = () => {
    window.open('https://dexra.co/lists', '_blank', 'noopener,noreferrer');
  };

  const handleGetLists = async () => {
    try {
      setLoading(true);
      const lists = await getLists();
      setLoading(false);
      setLists(lists);
    } catch (err) {
      setLoading(false);
      setErrorMessage('You need to be logged in.');
      console.log(err);
    }
  };

  const handleGetUserLists = async () => {
    try {
      const lists = await getLists();
      setLists(lists);
    } catch (err) {
      setErrorMessage('You need to be logged in.');
      console.log(err);
    }
  };

  let isSubmitDisabled = !selectedList || !selectedDate || isFetching;
  const handleSubmit = async () => {
    if (selectedList) {
      setIsFetching(true);
      const url = await getListUrl(selectedList, selectedDate);
      const count = lists.find((list) => list.id === selectedList)[
        'numberMonitored'
      ];
      setIsFetching(false);

      const newUrl = `${url}&browser=${selectedList}&c=${count}`;
      window.history.pushState({ path: newUrl }, '', newUrl); // Update the history state
      window.location.href = newUrl; // Navigate to the new URL
    }
  };

  // Ensure the state is maintained when the user navigates back
  window.onpopstate = function (event) {
    if (event.state && event.state.path) {
      if (
        event.state.path.includes('&browser') &&
        event.state.path.includes('&c')
      ) {
        window.location.href = event.state.path; // Use the stored state path
        document.documentElement.style.display = 'none';
      }
    } else {
      // Handle the case where there is no state saved (optional fallback)
      window.history.go(0); // Reload the page from the server if needed
    }
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className={`toggle-button ${isOpen ? 'open-btn' : ''}`}
      >
        <svg
          style={{ width: '39px', height: '35px', marginTop: '5px' }}
          viewBox="0 0 287 269"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.632812 59.2273L23.4925 38.4458V59.2273H0.632812Z"
            fill="white"
          />
          <path
            d="M30.7656 32.2114H50.5081L94.6688 79.4894L74.4068 100.79H30.7656V32.2114Z"
            fill="white"
          />
          <path
            d="M173.118 7.27344V100.79H84.7969L173.118 7.27344Z"
            fill="white"
          />
          <path
            d="M180.391 0L275.466 3.11723L180.391 93.5168V0Z"
            fill="white"
          />
          <path
            d="M273.654 15.3393L285.982 20.8608L242.739 44.6696L273.654 15.3393Z"
            fill="white"
          />
          <path
            d="M37 108.064H170.521L133.115 210.413L37 108.064Z"
            fill="white"
          />
          <path
            d="M171.04 127.806V268.081L127.398 244.183L171.04 127.806Z"
            fill="white"
          />
        </svg>
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-container">
          <div className="header-container">
            <div className="logo-container">
              <svg
                width="96"
                height="36"
                viewBox="0 0 1019 374"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M372.742 275V114H442.492C458.826 114 472.576 116.75 483.742 122.25C494.909 127.583 503.409 136.25 509.242 148.25C515.076 160.083 517.992 175.833 517.992 195.5C517.992 223.167 511.576 243.333 498.742 256C486.076 268.667 467.326 275 442.492 275H372.742ZM412.992 244H436.992C445.659 244 452.909 242.75 458.742 240.25C464.742 237.583 469.242 232.75 472.242 225.75C475.409 218.75 476.992 208.667 476.992 195.5C476.992 182.167 475.576 171.917 472.742 164.75C470.076 157.417 465.742 152.333 459.742 149.5C453.909 146.5 446.326 145 436.992 145H412.992V244ZM599.514 277.5C578.847 277.5 562.264 272.417 549.764 262.25C537.264 251.917 531.014 236.417 531.014 215.75C531.014 196.917 536.18 181.917 546.514 170.75C556.847 159.583 572.347 154 593.014 154C611.847 154 626.43 158.833 636.764 168.5C647.097 178.167 652.264 191.167 652.264 207.5V228.75H568.264C570.097 236.583 574.347 242.083 581.014 245.25C587.847 248.25 597.097 249.75 608.764 249.75C615.264 249.75 621.847 249.167 628.514 248C635.347 246.833 641.014 245.333 645.514 243.5V269.75C639.847 272.417 633.097 274.333 625.264 275.5C617.43 276.833 608.847 277.5 599.514 277.5ZM568.264 205.5H617.264V200.25C617.264 194.417 615.514 189.833 612.014 186.5C608.514 183 602.597 181.25 594.264 181.25C584.597 181.25 577.847 183.25 574.014 187.25C570.18 191.083 568.264 197.167 568.264 205.5ZM652.752 275L698.252 214.75L654.502 156.5H698.252L720.252 186.25L742.252 156.5H786.002L742.252 214.75L787.752 275H743.752L720.252 243.75L696.752 275H652.752ZM804.451 275V156.5H842.701L843.951 167.5C849.118 164.333 855.535 161.5 863.201 159C870.868 156.333 878.535 154.667 886.201 154V184.25C881.868 184.75 877.035 185.583 871.701 186.75C866.535 187.75 861.535 189 856.701 190.5C852.035 192 848.035 193.583 844.701 195.25V275H804.451ZM928.307 277.5C920.807 277.5 913.807 276.167 907.307 273.5C900.973 270.833 895.89 266.75 892.057 261.25C888.223 255.583 886.307 248.583 886.307 240.25C886.307 228.083 890.39 218.583 898.557 211.75C906.89 204.75 919.307 201.25 935.807 201.25H968.807V198.5C968.807 192.5 966.807 188.25 962.807 185.75C958.807 183.083 951.307 181.75 940.307 181.75C926.807 181.75 913.557 183.833 900.557 188V162C906.39 159.667 913.473 157.75 921.807 156.25C930.307 154.75 939.223 154 948.557 154C966.89 154 981.223 157.75 991.557 165.25C1002.06 172.75 1007.31 184.667 1007.31 201V275H972.057L970.057 265C965.723 269 960.14 272.083 953.307 274.25C946.64 276.417 938.307 277.5 928.307 277.5ZM941.057 252.75C947.39 252.75 952.89 251.667 957.557 249.5C962.223 247.333 965.973 244.583 968.807 241.25V224.5H940.307C928.473 224.5 922.557 229.25 922.557 238.75C922.557 243.083 924.057 246.5 927.057 249C930.057 251.5 934.723 252.75 941.057 252.75Z"
                  fill="black"
                />
                <rect
                  x="0.632812"
                  y="42.6675"
                  width="302.364"
                  height="281.406"
                  rx="46"
                  fill="#0A66C2"
                />
                <path
                  d="M54.5 133.769L71.0109 118.239V133.769H54.5Z"
                  fill="white"
                />
                <path
                  d="M76.25 113.58H90.5094L122.405 148.912L107.771 164.83H76.25V113.58Z"
                  fill="white"
                />
                <path
                  d="M179.089 94.9438V164.83H115.297L179.089 94.9438Z"
                  fill="white"
                />
                <path
                  d="M184.344 89.5083L253.014 91.8379L184.344 159.395V89.5083Z"
                  fill="white"
                />
                <path
                  d="M251.702 100.972L260.606 105.098L229.373 122.891L251.702 100.972Z"
                  fill="white"
                />
                <path
                  d="M80.7656 170.265H177.204L150.186 246.752L80.7656 170.265Z"
                  fill="white"
                />
                <path
                  d="M177.599 185.019V289.849L146.078 271.989L177.599 185.019Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>

          <div>
            <div className="dropdown-container">
              <label htmlFor="listDropdown" className="dropdown-label">
                Select List:
              </label>

              <select
                id="listDropdown"
                className={`dropdown ${selectedList ? 'selected' : ''}`}
                onChange={handleSelectChange}
                value={selectedList}
                onClick={handleGetLists}
              >
                <option style={{ color: 'gray' }} value="default">
                  Select list...
                </option>

                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
              <div
                style={{ color: 'red', fontWeight: '500', fontSize: '15px' }}
              >
                {loading && (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '10px',
                    }}
                  >
                    <Loader width="25px" />
                  </div>
                )}
                {errorMessage}
              </div>
            </div>
            <div className="radio-group">
              <label className="radio-label">Date Posted</label>
              <div className="first-two">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="timeFrame"
                    value="past-24h"
                    checked={selectedDate === 'past-24h'}
                    onChange={handleRadioChange}
                  />{' '}
                  1 day ago
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="timeFrame"
                    value="past-week"
                    checked={selectedDate === 'past-week'}
                    onChange={handleRadioChange}
                  />{' '}
                  Past Week
                </label>
              </div>
              <label className="radio-option">
                <input
                  type="radio"
                  name="timeFrame"
                  value="past-month"
                  checked={selectedDate === 'past-month'}
                  onChange={handleRadioChange}
                />{' '}
                Past Month
              </label>
            </div>
            <div className="button-container">
              <button
                className="submit-button"
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
              >
                Show List
              </button>
            </div>
            {isFetching && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '30px',
                }}
              >
                <Loader width="30px" />
              </div>
            )}
            <div className="divider"></div>
            <div
              className="manage-lists"
              style={{ marginTop: '-10px' }}
              onClick={handleManageListsClick}
            >
              <p className="manage-lists-text">Manage Lists</p>
              <img
                width="28px"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA8UlEQVR4nO2UwQnCMBhG36F6dgF3EEHx4hCuo/QkuIFT1FZ7cBrBay+KI1QKXyGUQlNNCmI++A/9k+Y9khAICfGXCIiBuypWb5CMgAQoG7UbCn4S8AksgbW+b0PD5+qv+giUPSvR2VbwtAU+13fV37oWSAx41gGv51oL2MaEv4CF+jPgoX6qebgWGAFnl/A+AmMfcFsBb3AbgQqed1y4TPDIh8CmA3424IkPgb3GDy3wi3YI4yl2LnDV+FESNTw34DbrfCxQtDxITbg3ganGCu3EXneiCfcmMJHEt+v4+bGRIFCGI+DLS1g6qt8TCPmvvAHKrMYgnwGQjwAAAABJRU5ErkJggg=="
              />{' '}
            </div>
          </div>
          {user && (
            <div>
              <div className="divider" style={{ marginTop: '35px' }}></div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  rowGap: '20px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    textWrap: 'nowrap',
                    columnGap: '15px',
                    marginTop: '10px',
                  }}
                >
                  <img
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                    }}
                    src={
                      user.profileImage &&
                      !user.profileImage.includes('data:image/gif')
                        ? user.profileImage
                        : user
                        ? 'https://i.seadn.io/gae/y2QcxTcchVVdUGZITQpr6z96TXYOV0p3ueLL_1kIPl7s-hHn3-nh8hamBDj0GAUNAndJ9_Yuo2OzYG5Nic_hNicPq37npZ93T5Nk-A?auto=format&dpr=1&w=1000'
                        : ''
                    }
                    alt=""
                  />
                  <p>{user.name}</p>
                </div>
                {buttonLoading ? (
                  <Loader width="27px" />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      onClick={toggleDropdown}
                      className="add-user-button"
                      disabled={alreadyMonitored}
                      style={{
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '15px',
                        backgroundColor: '#0b66c2',
                      }}
                    >
                      {alreadyMonitored ? 'Added' : 'Add User'}
                    </button>
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'red',
                        fontWeight: '500',
                        textAlign: 'center',
                        marginTop: '20px',
                      }}
                    >
                      {addErrorMessage}
                    </div>
                  </div>
                )}

                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="dropdown-container"
                    style={{
                      position: 'absolute',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      width: '150px',
                      zIndex: '100',
                      padding: '20px',
                      top: '20px',
                    }}
                  >
                    <select
                      className="list-dropdown"
                      style={{
                        width: '100%',
                        padding: '6px 12px',
                        marginBottom: '10px',
                      }}
                      value={selectedAddList}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetUserLists();
                      }}
                      onChange={handleSelectAddListChange}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                    >
                      <option value="">Select list...</option>
                      {lists.map((list) => (
                        <option
                          key={list.id}
                          disabled={list.numberMonitored >= 25}
                          value={list.id}
                        >
                          {list.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddUserToList(e);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      disabled={!selectedAddList}
                      className="add-button"
                      style={{
                        width: '100%',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '15px',
                        backgroundColor: '#0b66c2',
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
