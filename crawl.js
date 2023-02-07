const { JSDOM } = require("jsdom");

const crawlPage = async (baseURL, currentURL, pages) => {
  if (new URL(baseURL).hostname !== new URL(currentURL).hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  // if we've already visited this page
  // just increase the count and don't repeat
  // the http request
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  // initialize this page in the map
  // since it doesn't exist yet
  pages[normalizedCurrentURL] = 1;
  console.log(`actively crawling: ${currentURL}`);
  let body;
  try {
    const res = await fetch(currentURL);

    if (res.status > 399) {
      console.log(
        `error in fetch with status code: ${res.status}, on page: ${currentURL}`
      );
      return pages;
    }

    const contentType = res.headers.get("Content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `Received non html response: ${contentType}, on page: ${currentURL}`
      );
      return pages;
    }
    body = await res.text();
  } catch (err) {
    console.log(
      `error in fetch: ${err.message}, on page: ${currentURL}, base URL: ${baseURL}`
    );
  }
  const nextURLs = getUrlsFromHtml(body, currentURL);

  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }
  return pages;
};

const normalizeURL = (url) => {
  const urlObj = new URL(url);
  const host = urlObj.hostname;
  const path = urlObj.pathname;
  const hostPath = `${host}${path}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
};

const getUrlsFromHtml = (htmlBody, baseURL) => {
  const dom = new JSDOM(htmlBody);
  const links = dom.window.document.querySelectorAll("a");
  const urls = [];
  for (const link of links) {
    if (link.href.startsWith("/")) {
      try {
        const urlObj = new URL(link.href, baseURL);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with relative url: ${err.message}`);
      }
    } else {
      try {
        const urlObj = new URL(link.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with absolute url: ${err.message}`);
      }
    }
  }
  return urls;
};

module.exports = {
  normalizeURL,
  getUrlsFromHtml,
  crawlPage,
};
