const { normalizeURL, getUrlsFromHtml } = require("./crawl");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip HTTPS protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL trim slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL uppercase characters", () => {
  const input = "https://BLOG.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip HTTP protocol", () => {
  const input = "http://BLOG.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("getURLSFromHTML absolute", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="http://blog.boot.dev/path/"> Boot.dev Blog </a>
      </body>
    </html>
  `;
  const inputBaseURL = "http://blog.boot.dev/path/";
  const actual = getUrlsFromHtml(inputHTMLBody, inputBaseURL);
  const expected = ["http://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURLSFromHTML relative", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="/path/"> Boot.dev Blog </a>
      </body>
    </html>
  `;
  const inputBaseURL = "http://blog.boot.dev";
  const actual = getUrlsFromHtml(inputHTMLBody, inputBaseURL);
  const expected = ["http://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURLSFromHTML absolute and relative", () => {
  const inputHTMLBody = `
    <html>
      <body>
      <a href="http://blog.boot.dev/path1/"> Boot.dev Blog 1 </a>
        <a href="/path2/"> Boot.dev Blog 2 </a>
      </body>
    </html>
  `;
  const inputBaseURL = "http://blog.boot.dev";
  const actual = getUrlsFromHtml(inputHTMLBody, inputBaseURL);
  const expected = [
    "http://blog.boot.dev/path1/",
    "http://blog.boot.dev/path2/",
  ];
  expect(actual).toEqual(expected);
});

test("getURLSFromHTML invalid URL", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="invalid"> Boot.dev Blog </a>
      </body>
    </html>
  `;
  const inputBaseURL = "http://blog.boot.dev";
  const actual = getUrlsFromHtml(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});