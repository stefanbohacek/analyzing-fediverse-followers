const parseLinkHeader = (headers) => {
  const linkHeader = headers.get('link');

  let parts = linkHeader.split(',');
  let links = {};

  parts.forEach(link => {
    let section = link.split(';');
    if (section.length != 2) {
      throw new Error("section could not be split on ';'");
    }
    let url = section[0].replace(/<(.*)>/, '$1').trim();
    let name = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = url;
  });

  return links;
};

export default parseLinkHeader;
