import fs from "fs";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import puppeteer, { Page } from "puppeteer";
import { Surreal } from "surrealdb.js";

export async function onSuccess() {
    const config = {
        "sitemap": `${process.env.DEPLOY_URL}/sitemap.xml`,
        "surreal": {
            "url": process.env.SURREAL_ENDPOINT,
            "ns": process.env.SURREAL_NAMESPACE,
            "db": process.env.SURREAL_DATABASE,
            "user": process.env.SURREAL_USERNAME,
            "pass": process.env.SURREAL_PASSWORD
        }
    };

    console.log(JSON.stringify(config));

    if (process.env.DEPLOY_URL == 'https://0--surrealdb-docs.netlify.app') {
        console.log('!!!!! NOT RUNNING POST DEPLOY CRAWLER !!!!!');
        return;
    }

    const db = await initSurreal(config);
    await crawl(config, db);
}

const parseSitemap = async (db, page, sitemapPath) => {
  let xmlData;
  // The sitemap can be loaded from the website
  if (sitemapPath.startsWith("http")) {
    const response = await axios.get(sitemapPath);
    xmlData = response.data;
  } else {
    // Or from the local file system
    xmlData = fs.readFileSync(sitemapPath, "utf8");
  }

  const replacementHostname = new URL(process.env.DEPLOY_URL).hostname;
  const sitemap = await parseStringPromise(xmlData);
  const urls = sitemap.urlset.url;
  console.log(`The sitemap at "${sitemapPath}" contains ${urls.length} url(s)`);
  const locs = urls.map((url) => {
    url = url.loc[0];
    url = new URL(url);
    url.hostname = replacementHostname;
    return url.toString();
  });
  for (const [index, loc] of locs.entries()) {
    console.log(`Crawling page ${index + 1}/${locs.length}: ${loc}`);
    await scrapPage(db, page, loc);
  }
  return locs.length;
};

const scrapPage = async (db, page, url) => {
  await page.goto(url, { waitUntil: "networkidle2" });

  const title = await page.title();

  // Extract H1:
  const h1 = extractText(
    await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("h1"),
        (element) => element.textContent
      )
    )
  );

  // Extract H2:
  const h2 = extractText(
    await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("h2"),
        (element) => element.textContent
      )
    )
  );

  // Extract H3:
  const h3 = extractText(
    await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("h3"),
        (element) => element.textContent
      )
    )
  );

  // Extract H4:
  const h4 = extractText(
    await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("h4"),
        (element) => element.textContent
      )
    )
  );

  // Extract code:
  const code = extractText(
    await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("code"),
        (element) => element.textContent
      )
    )
  );

  // Extract every indexable text blocks
  const content = extractText(
    await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("p,h1,h2,h3,h4,h5,h6,tr,th,td,code"),
        (element) => element.textContent
      )
    )
  );

  if (content.length > 0) {
    await indexPage(db, url, title, h1, h2, h3, h4, content, code);
  }
};

const extractText = (blocks) => {
  const text = [];
  for (const block of blocks) {
    if (block) {
      // Make the block prettier, by removing any extra spaces.
      const parts = block.split(/\s+/);
      const trimmedParts = parts.filter(Boolean); // This removes any empty strings
      const trimmedBlock = trimmedParts.join(" ");
      if (trimmedBlock.length > 0) {
        text.push(trimmedBlock);
      }
    }
  }
  return text;
};

const indexPage = async (db, url, title, h1, h2, h3, h4, content, code) => {
  const u = new URL(url);
  const path = u.pathname;
  const recordId = `page:⟨${path}⟩`;
  console.log(`Indexing "${recordId}"`);
  await db.delete(recordId);
  const start = Date.now();
  await db.create("page", {
    id: u.pathname,
    title,
    path,
    h1,
    h2,
    h3,
    h4,
    content,
    code,
  });
  const elapsed = Date.now() - start;
  console.log(`Elapsed time: ${elapsed} ms`);
};

const crawl = async (config, db) => {
  let browser;
  try {
    // Start the headless browser
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });

    // Start the crawling
    const count = await parseSitemap(db, page, config.sitemap);
    console.log(`${count} page(s) crawled`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const initSurreal = async (config) => {
  // Connect to SurrealDB instance
  const db = new Surreal();
  await db.connect(config.surreal.url);

  // Select a specific namespace / database
  await db.use({ namespace: config.surreal.ns, database: config.surreal.db });

  // Signin as a namespace, database, or root user
  await db.signin({
    namespace: config.surreal.ns, 
    database: config.surreal.db,
    username: config.surreal.user,
    password: config.surreal.pass,
  });

  return db;
};

const execute = async (db, sql) => {
  const start = Date.now();
  const res = await db.query(sql);
  const elapsed = Date.now() - start;
  for (const r of res) {
    console.log(r);
  }
  console.log(`Elapsed time: ${elapsed} ms`);
};

const initIndex = async (db) => {
  const sql =
    /* surql */ `DEFINE ANALYZER simple TOKENIZERS blank,class,camel,punct FILTERS snowball(english);\
  DEFINE INDEX page_title ON page FIELDS title SEARCH ANALYZER simple BM25(1.2,0.75);\
  DEFINE INDEX page_path ON page FIELDS path SEARCH ANALYZER simple BM25(1.2,0.75);\
  DEFINE INDEX page_h1 ON page FIELDS h1 SEARCH ANALYZER simple BM25(1.2,0.75);\
  DEFINE INDEX page_h2 ON page FIELDS h2 SEARCH ANALYZER simple BM25(1.2,0.75);\
  DEFINE INDEX page_h3 ON page FIELDS h3 SEARCH ANALYZER simple BM25(1.2,0.75);\
  DEFINE INDEX page_h4 ON page FIELDS h4 SEARCH ANALYZER simple BM25(1.2,0.75);\
  DEFINE INDEX page_content ON page FIELDS content SEARCH ANALYZER simple BM25(1.2,0.75) HIGHLIGHTS;\
  DEFINE INDEX page_code ON page FIELDS code SEARCH ANALYZER simple BM25(1.2,0.75);`;
  await execute(db, sql);
};

const search = async (db, keywords) => {
  const sql = /* surql */ `SELECT \
    id, \
    title, \
    search::highlight('<b>', '</b>', 6) AS content, \
    search::score(0) * 7 + search::score(1) * 6 + search::score(2) * 5 + search::score(3) * 4 \
    + search::score(4) * 3 + search::score(5) * 2 + search::score(6) AS score \
  FROM page \
  WHERE title @0@ '${keywords}' \
    OR path @1@ '${keywords}' \
    OR h1 @2@ '${keywords}' \
    OR h2 @3@ '${keywords}' \
    OR h3 @4@ '${keywords}' \
    OR h4 @5@ '${keywords}' \
    OR content @6@ '${keywords}' \
  ORDER BY score DESC LIMIT 10`;
  await execute(db, sql);
};

const fast = async (db, keywords) => {
  const sql = /* surql */ `SELECT \
    id, \
    title, \
    search::highlight('<b>', '</b>', 0) AS content, \
    search::score(0) AS score \
  FROM page \
  WHERE content @0@ '${keywords}' \
  ORDER BY score DESC LIMIT 10`;
  await execute(db, sql);
};