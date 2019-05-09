export  async function request(option) {
  const { url, data, method = "GET" } = option;

  return new Promise((resolve, reject) => {
    let fetchItem;

    if (method == "GET") {
      fetchItem = fetch(url);
    } else if (method == "POST") {
      fetchItem = fetch(url, {
        body: JSON.stringify(data),
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
          "user-agent": "Mozilla/4.0 MDN Example",
          "content-type": "application/json"
        },
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer" // *client, no-referrer
      });
    }

    fetchItem
      .then(r => {
        return r.json();
      })
      .then(resData => {
        resolve(resData);
      })
      .catch(err => {
        reject(err);
      });
  });
}


export async function requestSync(option) {
  const { url, data, method = "GET" } = option;

    let fetchItem;

    if (method == "GET") {
      fetchItem = await fetch(url);
    } else if (method == "POST") {
      fetchItem = await fetch(url, {
        body: JSON.stringify(data),
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
          "user-agent": "Mozilla/4.0 MDN Example",
          "content-type": "application/json"
        },
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer" // *client, no-referrer
      });
    }

    let res = await fetchItem.json()
    return res
}

