import sleep from "./sleep.js";

const paginatedFetch = async (url, page = 1, previousResponse = []) => {
  await sleep(1000);  
  return fetch(`${url}&page=${page}`)
    .then(response => response.json())
    .then(newResponse => {
      const response = [...previousResponse, ...newResponse];
      
      if (newResponse.length !== 0) {
        page++;

        return paginatedFetch(url, page, response);
      }

      return response;
    });
}



const callAPI = async (endpoint, method) => {
  await sleep(1000);   
  let results = [];
  let next = null;

  try {
    const url = new URL(`${process.env.MASTODON_INSTANCE}/api/v1/${endpoint}`)

    const params = {
      // hello: 'world'
    };
    
    url.search = new URLSearchParams(params).toString();

    const resp = await fetch(url,{
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.MASTODON_ACCESS_TOKEN}`,
      },
    });

    const respJSON = await resp.json();
    const links = parseLinkHeader(resp.headers);

    console.log(`calling endpoint ${endpoint}`,{
      results: respJSON.length,
      links
    });

    return [respJSON, links?.next];
  } catch (error) {
    console.log(error);
    return [respJSON, links?.next];
  }
}

const mastodon = async (endpoint, method) => {
  let results = [];
  let haveAllResults = false;

  let loopIndex = 0;

  while (!haveAllResults) {
    console.log(`loop ${++loopIndex}:`);
    const [r, next] = await callAPI(endpoint, method);

    results.push(r);
    if (!next){
      haveAllResults = true;
    } else {
      endpoint = next.replace(`${process.env.MASTODON_INSTANCE}/api/v1/`, '');
    }
  }

  return results;

};

export default mastodon;
