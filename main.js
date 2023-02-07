const { crawlPage } = require("./crawl");
const { printReport } = require("./report");

async function main() {
  if (process.argv.length != 3) {
    console.log("Invalid number of arguments provided");
    process.exit(1);
  } else {
    const arguments = process.argv;
    const baseURL = process.argv[2];
    console.log(`starting crawling of: ${baseURL}`);
    const pages = await crawlPage(baseURL, baseURL, {});

    printReport(pages);
  }
}

main();
