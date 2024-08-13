const addDuplicateLists = require('../modules/addDuplicateLists');
const addList = require('../modules/addList');
const createHeaders = require('./createHeaders');
const cheerio = require('cheerio');

const extractPeopleFromHtml = (html) => {
  const $ = cheerio.load(html);
  const dataProps = $('div[data-react-props]')[0].attribs['data-react-props'];
  const people = JSON.parse(dataProps)['people'];
  const listName = JSON.parse(dataProps)['list']['name'];
  const listValue = JSON.parse(dataProps)['list']['id'];

  const filteredPeople = people
    .map((p) => ({
      firstName: p['first_name'],
      fullName: p['full_name'],
      headline: p['headline'],
      profileImage: p['headshot_url'],
      lastName: p['last_name'],
      profileUrl: p['profile_url'],
    }))
    .filter((p) => p['profile_url'] !== null);

  return { name: listName, users: filteredPeople, value: listValue };
};

async function getAwareLists() {
  const headers = await createHeaders();
  const response = await fetch(`https://app.useaware.co/`, {
    headers,
    method: 'GET',
    credentials: 'include',
  });
  console.log(response.status);
  if (response.status >= 200 && response.status < 300) {
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);

    console.log(
      JSON.parse($('div[data-react-props]')[0].attribs['data-react-props'])[
        'lists'
      ]
    );
    const lists = JSON.parse(
      $('div[data-react-props]')[0].attribs['data-react-props']
    )['lists'].filter(
      (list) =>
        list.value !== 'all' &&
        list.value !== 'addedit' &&
        list.label !== 'LinkedIn growth'
    );

    return lists;
  }
  return false;
}

async function getAwareUsers(selectedLists) {
  const headers = await createHeaders();
  const response = await fetch(`https://app.useaware.co/`, {
    headers,
    method: 'GET',
    credentials: 'include',
  });
  const htmlString = await response.text();
  const $ = cheerio.load(htmlString);

  const lists = JSON.parse(
    $('div[data-react-props]')[0].attribs['data-react-props']
  )['lists'].filter(
    (list) =>
      selectedLists.findIndex(
        (selectedList) => selectedList.value === list.value
      ) !== -1
  );

  const commonData = JSON.parse(
    $('div[data-react-props]')[0].attribs['data-react-props']
  )['commonData'];
  const { currentAccountUniqueToken: id, linkedinUserId: linkedinId } =
    commonData;

  const fetchPromises = lists.map(async (list) => {
    const res = await fetch(
      `https://app.useaware.co/0/${id}/li/${linkedinId}/lists/${list.value}`,
      {
        headers,
        method: 'GET',
        credentials: 'include',
      }
    );
    return res.text();
  });

  const htmlPages = await Promise.all(fetchPromises);

  const awareListsPromises = htmlPages.map(async (html) => {
    const { name, users, value } = extractPeopleFromHtml(html);
    const res = await addList(`${name} - Aware`, value);

    const length = users.length;

    if (length > 25) {
      const count = Math.ceil(length / 25);
      const addedLists = await addDuplicateLists(
        res['data']['id'],
        count - 1,
        true
      );
      let usersPerList = 25;
      if (length % 25 < 15) {
        usersPerList = Math.ceil(length / Math.ceil(length / 25));
      }

      for (let i = 0; i < count; i++) {
        lists.push([]);
        for (let j = 0; j < usersPerList; j++) {
          const tmp = users.pop();
          if (!tmp) break;
          if (tmp.profileUrl) {
            const id = i === 0 ? res['data']['id'] : addedLists[i - 1]['id'];
            lists[i + 1].push({ ...tmp, listId: id });
          }
        }
      }

      return lists.flat();
    } else {
      return users.map((user) => ({ ...user, listId: res['data']['id'] }));
    }
  });

  const awareLists = await Promise.all(awareListsPromises);

  const filteredAwareLists = awareLists
    .flat()
    .filter((list) => list.profileUrl);

  return filteredAwareLists;
}

exports.getAwareUsers = getAwareUsers;
exports.getAwareLists = getAwareLists;
