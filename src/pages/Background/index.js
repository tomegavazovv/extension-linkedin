const { getAwareUsers, getAwareLists } = require('./awareClient/getAwareUsers');
const addDuplicateLists = require('./modules/addDuplicateLists');
const addMonitoredUser = require('./modules/addMonitoredUser');
const awareListsUploaded = require('./modules/awareListsUploaded');
const commentToPost = require('./modules/commentToPost');
const likePost = require('./modules/likePost');
const searchUser = require('./modules/searchUser');

function setupAlarm(interval) {
  let randomInterval = 1.2 + Math.random() * 1.5;
  if (interval) randomInterval = interval;
  console.log(randomInterval);
  chrome.alarms.create('csvAlarm', {
    delayInMinutes: randomInterval,
  });
}

function setupAwareAlarm(interval) {
  let randomInterval = 1.2 + Math.random() * 1.5;
  if (interval) randomInterval = interval;

  console.log(randomInterval);
  chrome.alarms.create('AwareAlarm', {
    delayInMinutes: randomInterval,
  });
}

function handleAlarm() {
  chrome.storage.local.get(`csvData`, (data) => {
    const csvData = data[`csvData`];
    const rows = JSON.parse(csvData);
    if (csvData && rows.length > 0) {
      const rowToProcess = rows.shift();

      try {
        console.log('Processing row:', rowToProcess);
        const items = rowToProcess.url.split('/');
        const index = items.findIndex((item) => item === 'in');
        const publicId = items[index + 1];
        const listId = rowToProcess.listId;
        addMonitoredUser({ listId, publicId })
          .then((res) => {
            console.log(res);

            chrome.storage.local.set(
              { [`csvData`]: JSON.stringify(rows) },
              () => {
                if (chrome.runtime.lastError) {
                  // Log the error or handle it as needed
                  console.error(
                    'Error during storage:',
                    chrome.runtime.lastError
                  );
                } else {
                  console.log('setting the alarm');
                  setupAlarm();
                }
              }
            );
          })
          .catch((err) => {
            console.log(err.message);
            if (err.message.includes('Limit')) {
              const hours = err.message.split('[')[1].split(']')[0];
              const minutes = Number(hours) * 60;

              chrome.storage.local.set(
                {
                  [`csvData`]: JSON.stringify([...rows, rowToProcess]),
                },
                () => {
                  setupAlarm(minutes);
                }
              );
            } else {
              chrome.storage.local.set(
                {
                  [`csvData`]: JSON.stringify([...rows]),
                },
                () => {
                  setupAlarm();
                }
              );
            }
          });
      } catch (err) {
        if (err.message.includes('You passed the limit')) {
          const interval =
            (Number(err.message.split('[')[1].split(']')[0]) + 1) * 60;
          setupAlarm(interval);
        }
      }
    } else {
      chrome.alarms.clear(`csvAlarm`);
      console.log('All rows processed, alarm cleared.');
    }
  });
}

async function handleAwareAlarm() {
  chrome.storage.local.get('AwareUsers', async ({ AwareUsers }) => {
    const rows = JSON.parse(AwareUsers);
    if (rows && rows.length > 0) {
      const rowToProcess = rows.shift();
      const { listId, profileUrl } = rowToProcess;
      const publicId = profileUrl.split('in/')[1].split('/')[0].split('?')[0];

      addMonitoredUser({ listId, publicId })
        .then((res) => {
          console.log(res);
          chrome.storage.local.set({ AwareUsers: JSON.stringify(rows) }, () => {
            console.log('setup aware alarm again');
            setupAwareAlarm();
          });
          res.json().then((data) => {
            console.log(data);
            if (data['hours']) {
              const hours = data['hours'];
              const minutes = Number(hours) * 60;

              chrome.storage.local.set(
                { AwareUsers: JSON.stringify([...rows, rowToProcess]) },
                () => {
                  setupAwareAlarm(minutes);
                }
              );
            }
          });
        })
        .catch((err) => {
          console.log(err.message);
          if (err.message.includes('Limit')) {
            const hours = err.message.split('[')[1].split(']')[0];
            const minutes = Number(hours) * 60;

            chrome.storage.local.set(
              { AwareUsers: JSON.stringify([...rows, rowToProcess]) },
              () => {
                setupAwareAlarm(minutes);
              }
            );
          } else {
            chrome.storage.local.set(
              { AwareUsers: JSON.stringify([...rows]) },
              () => {
                setupAwareAlarm();
              }
            );
          }
        });
    } else {
      await awareListsUploaded();
      chrome.alarms.clear('AwareAlarm');
      console.log('All rows processed, alarm cleared.');
    }
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'inputSubmitted') {
    const { url, listId } = message.value;
    const items = url.split('/');
    const index = items.findIndex((item) => item === 'in');

    if (index !== -1 && index + 1 < items.length) {
      const publicId = items[index + 1].split('?')[0];
      addMonitoredUser({ listId, publicId })
        .then(
          ({
            firstName,
            lastName,
            headline,
            image,
            urn,
            company,
            id,
            publicId,
          }) => {
            sendResponse({
              status: 'success',
              content: {
                firstName,
                lastName,
                headline,
                image,
                urn,
                company,
                id,
                publicId,
              },
            });
          }
        )
        .catch((err) => {
          if (err.message.includes('Limit'))
            sendResponse({ status: 'limit', err: err.message });
          else sendResponse({ status: 'failed' });
        });
    }
    return true;
  } else if (message.type === 'commentSubmitted') {
    const { urn, comment } = message.value;
    commentToPost(urn, comment).then((response) =>
      sendResponse({ response: response })
    );
    return true;
  } else if (message.type === 'likeSubmitted') {
    const { urn, reactionType } = message.value;
    const encodedURN = encodeURIComponent(urn);
    likePost(encodedURN, reactionType).then((res) =>
      sendResponse({ responseStatus: res })
    );
    return true;
  } else if (message.type === 'searchUser') {
    const { query, trackingId } = message.value;
    searchUser(query, trackingId).then((res) =>
      sendResponse({ response: res })
    );
    return true;
  } else if (message.type === 'addByUrn') {
    const { urn, listId } = message.value;
    addMonitoredUser({ listId, urnId: urn }).then((res) => {
      sendResponse({ status: 'Success', content: res });
    });
    return true;
  } else if (message.type === 'csvUploaded') {
    const { urls, listId, monitoredNumber } = message.value;
    const currentListSpace = 25 - monitoredNumber; // How many empty spaces in the current list
    const length = urls.length - currentListSpace; // Will everything fit in the current list?

    // will everyhing fit in the current list?
    if (length < 0) {
      const lists = urls.map((url) => ({ url, listId }));
      console.log('everything fits into the current list');
      chrome.storage.local.set({ [`csvData`]: JSON.stringify(lists) });
      setupAlarm();
    } else {
      let count = 0;
      count = Math.ceil(length / 25);
      console.log('not everything fits into the current list');
      console.log(count);
      addDuplicateLists(listId, count).then((addedLists) => {
        let usersPerList = 25;
        if (length % 25 < 15) {
          usersPerList = Math.ceil(length / Math.ceil(urls.length / 25));
        }
        console.log('Users per list: ' + usersPerList);

        const lists = [];
        lists.push([]);
        Array(currentListSpace)
          .fill()
          .forEach((_) => {
            const url = urls.pop();
            if (url) lists[0].push({ url, listId });
          });

        console.log(currentListSpace);

        for (let i = 0; i < count; i++) {
          lists.push([]);
          for (let j = 0; j < usersPerList; j++) {
            const url = urls.pop();
            if (!url) break;
            const id = addedLists[i]['id'];
            lists[i + 1].push({ url, listId: id });
          }
        }
        console.log(lists);
        chrome.storage.local.set({ [`csvData`]: JSON.stringify(lists.flat()) });
        setupAlarm();
      });
    }
  } else if (message.type === 'isCsvUploading') {
    const { listId } = message.value;
    chrome.storage.local.get(`csvData`, (data) => {
      const csvData = JSON.parse(data[`csvData`]);

      const item = csvData.findIndex((row) => row.listId === listId) !== -1;
      sendResponse(item);
    });
    return true;
  } else if (message.type === 'getCsvUploadingLists') {
    chrome.storage.local.get(`csvData`, (data) => {
      const csvData = JSON.parse(data[`csvData`]);
      const unique = [...new Set(csvData.map((item) => item.listId))]; // [ 'A', 'B']
      sendResponse(unique);
    });
    return true;
  } else if (message.type === 'syncAwareLists') {
    const { lists } = message.value;
    getAwareUsers(lists).then((users) => {
      console.log(users);
      sendResponse('');
      chrome.storage.local.set({ AwareUsers: JSON.stringify(users) });
      setupAwareAlarm();
    });
    return true;
  } else if (message.type === 'isAwareUploading') {
    chrome.alarms.get('AwareAlarm', function (alarm) {
      sendResponse(alarm);
    });
    return true;
  } else if (message.type === 'removedAwareList') {
    const { listId } = message.value;
    chrome.storage.local.get('AwareUsers', async ({ AwareUsers }) => {
      const rows = JSON.parse(AwareUsers);
      const filtered = rows.filter((row) => row['listId'] !== listId);
      chrome.storage.local.set({ AwareUsers: JSON.stringify(filtered) }, () => {
        console.log('deleted');
      });
    });
  } else if (message.type === 'removedCsvList') {
    const { listId } = message.value;
    chrome.storage.local.get('csvData', async ({ csvData }) => {
      const rows = JSON.parse(csvData);
      const filtered = rows.filter((row) => row['listId'] !== listId);
      chrome.storage.local.set({ csvData: JSON.stringify(filtered) }, () => {
        console.log('deleted');
      });
    });
  } else if (message.type === 'getAwareLists') {
    getAwareLists()
      .then((lists) => {
        sendResponse(lists);
      })
      .catch((err) => sendResponse(false));
    return true;
  } else if (message.type === 'checkAware') {
    getAwareLists()
      .then((lists) => {
        sendResponse(lists);
      })
      .catch((err) => sendResponse(false));
    return true;
  } else if (message.type === 'userLoggedIn') {
    const { token } = message.value;
    console.log(token);
    chrome.storage.local.set({ token });
  } else if (message.type === 'userLoggedOut') {
    chrome.storage.local.remove('token');
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'csvAlarm') {
    handleAlarm();
  } else if (alarm.name === 'AwareAlarm') {
    await handleAwareAlarm();
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    console.log('changed url');
    if (
      tab.url &&
      tab.url.startsWith('https://www.linkedin.com/in/') &&
      !tab.url.includes('miniProfileUrn')
    ) {
      chrome.tabs.sendMessage(tabId, {
        message: 'profileOpened',
        url: changeInfo.url,
      });
    } else if (tab.url.includes('linkedin')) {
      chrome.tabs.sendMessage(tabId, {
        message: 'profileClosed',
        url: changeInfo.url,
      });
    }
  }
});
