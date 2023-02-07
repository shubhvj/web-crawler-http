const { JSDOM } = require("jsdom");

const crawlPage = async (baseURL, currentURL, pages) => {
  console.log(`actively crawling: ${currentURL}`);
  try {
    const res = await fetch(currentURL);

    if (res.status > 399) {
      console.log(
        `error in fetch with status code: ${res.status}, on page: ${currentURL}`
      );
      return [];
    }

    const contentType = res.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`non html response: ${contentType}, on page: ${currentURL}`);
      return [];
    }
    const body = await res.text();
    const urls = getUrlsFromHtml(body, currentURL);
    console.log(urls);
  } catch (err) {
    console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
  }
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
        const urlObj = new URL(`${baseURL}${link.href}`);
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
