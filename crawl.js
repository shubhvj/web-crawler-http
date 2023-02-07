const { JSDOM } = require("jsdom");
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
};
