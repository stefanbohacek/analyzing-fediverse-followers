// import parseLinkHeader from './parse-link-header.js';

import * as dotenv from 'dotenv';
import sleep from './sleep.js';

dotenv.config();

const fetchRequest = async function (url, method){
  await sleep(1000); 
  console.log('fetchRequest', {url, method: method || 'GET'});
  try {
    const response = await fetch(url, {
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.MASTODON_ACCESS_TOKEN}`,
      },
    });
    // console.log({
    //   url,
    //   response: {
    //     status: response.status,
    //     body: response.body,
    //   }
    // });
    let data = await response.json();
    let nextPage;

    if (/<([^>]+)>; rel="next"/g.test(response.headers.get("link"))){
      nextPage = /<([^>]+)>; rel="next"/g.exec(response.headers.get("link"))[1];
    }

    if (nextPage){
      data = data.concat(await fetchRequest(nextPage));
    }

    return data;
  } catch (error){
    console.log('fetchRequest', {error});
    return [];
  }
}

const mastodon = async (instance, endpoint, params, method) => {
  let data = [];
  try {
    const url = new URL(`https://${instance}/api/v1/${endpoint}`);

    console.log({url});

    url.search = new URLSearchParams(params || {}).toString();

    if (endpoint === 'accounts/relationships'){
      const idParams = params.id.map(id => `id[]=${id}&`).join('');
      const fullURL = `https://${instance}/api/v1/${endpoint}/?${idParams.substring(0, idParams.length - 1)}`
      await sleep(1000);
      data = await fetchRequest(fullURL, method);
    } else {
      await sleep(1000);
      data = await fetchRequest(url.href, method);
    }

    return data;

  } catch (error){
    console.log({error});
    return data;
  }
};

export default mastodon;
