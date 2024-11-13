const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News newest page
  await page.goto("https://news.ycombinator.com/newest");

  // Wait for the article items to load
  await page.waitForSelector('.itemlist .athing');

  // Retrieve the article timestamps for the first 100 articles
  const articles = await page.$$eval('.athing', items =>
    items.slice(0, 100).map(item => {
      const ageElement = item.nextElementSibling.querySelector('.age a');
      return ageElement ? ageElement.textContent : '';
    })
  );

  // Log the article timestamps in original order
  console.log("Original order of article timestamps:", articles);

  // Check if the articles are sorted in descending order (newest to oldest)
  let isSorted = true;
  for (let i = 0; i < articles.length - 1; i++) {
    const currentTime = new Date(articles[i]).getTime();
    const nextTime = new Date(articles[i + 1]).getTime();

    if (currentTime < nextTime) {
      isSorted = false;
      break;
    }
  }

  // Output result of sorting check
  if (isSorted) {
    console.log("The articles are sorted from newest to oldest.");
  } else {
    console.log("The articles are NOT sorted from newest to oldest.");
  }

  // Log the article timestamps again after sorting check
  console.log("Order after sorting check:", articles);

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
