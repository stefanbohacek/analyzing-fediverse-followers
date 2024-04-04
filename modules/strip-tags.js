//https://stackoverflow.com/questions/6847556/strip-tags-with-javascript-and-handle-line-breaks

const stripTags = (str) => str
  .replace(/(<(br[^>]*)>)/ig, '\n')
  .replace(/(<(p[^>]*)>)/ig, '')
  .replace(/(<(\/p[^>]*)>)/ig, '\n')
  .replace(/(<(div[^>]*)>)/ig, '\n')
  .replace(/(<(h[1-6][^>]*)>)/ig, '\n')
  .replace(/(<(li[^>]*)>)/ig, '\n')
  .replace(/(<(ul[^>]*)>)/ig, '\n')
  .replace(/(<(ol[^>]*)>)/ig, '\n')
  .replace(/(<(blockquote[^>]*)>)/ig, '\n')
  .replace(/(<(pre[^>]*)>)/ig, '\n')
  .replace(/(<(hr[^>]*)>)/ig, '\n')
  .replace(/(<(table[^>]*)>)/ig, '\n')
  .replace(/(<(tr[^>]*)>)/ig, '\n')
  .replace(/(<(td[^>]*)>)/ig, '\n')
  .replace(/(<(th[^>]*)>)/ig, '\n')
  .replace(/(<(caption[^>]*)>)/ig, '\n')
  .replace(/(<(dl[^>]*)>)/ig, '\n')
  .replace(/(<(dt[^>]*)>)/ig, '\n')
  .replace(/(<(dd[^>]*)>)/ig, '\n')
  .replace(/(<(address[^>]*)>)/ig, '\n')
  .replace(/(<(section[^>]*)>)/ig, '\n')
  .replace(/(<(article[^>]*)>)/ig, '\n')
  .replace(/(<(aside[^>]*)>)/ig, '\n');

export default stripTags;
