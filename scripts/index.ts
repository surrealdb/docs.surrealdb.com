import { Glob } from "bun";
import * as cheerio from "cheerio";

const repositoryName = "surrealdb/surrealdb";
const branch = "main";
const fncSourceCodeFilePath = "core/src/fnc/mod.rs";

const fncExclusions = [".chain"];

const detectMissingFunctions = async () => {
  console.log("Detecting missing functions...");
  console.log("--------------------------------------------------");

  const response = await fetch(
    `https://raw.githubusercontent.com/${repositoryName}/${branch}/${fncSourceCodeFilePath}`
  );
  const result = await response.text();

  let lineStartForSyncFns = -1;
  let lineEndForSyncFns = -1;

  let lineStartForAsyncFns = -1;
  let lineEndForAsyncFns = -1;

  const lines = result.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("pub fn synchronous(")) {
      lineStartForSyncFns = i;
      continue;
    }
    if (line.startsWith("pub async fn asynchronous(")) {
      lineStartForAsyncFns = i;
      continue;
    }

    if (line === "}") {
      if (lineStartForSyncFns > -1 && lineEndForSyncFns === -1) {
        lineEndForSyncFns = i;
        continue;
      }
      if (lineStartForAsyncFns > -1 && lineEndForAsyncFns === -1) {
        lineEndForAsyncFns = i;
        continue;
      }
    }
  }

  const allExistingFunctions: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (
      (lineStartForSyncFns <= i && i < lineEndForSyncFns) ||
      (lineStartForAsyncFns <= i && i < lineEndForAsyncFns)
    ) {
      const regexResult = /"(.+)" =>/gi.exec(line);
      if (regexResult) {
        allExistingFunctions.push(regexResult[1]);
      }
    }
  }

  const allDocumentedFunctions: string[] = [];

  const glob = new Glob(
    "../doc-surrealql_versioned_docs/version-latest/functions/database/*.mdx"
  );
  for await (const path of glob.scan(".")) {
    if (path.endsWith("index.mdx")) {
      continue;
    }

    const data = await Bun.file(path).text();
    const $ = cheerio.load(data);

    const functionNames = $('td[data-label="Function"]')
      .map((_, el) =>
        $(el)
          .text()
          .replace("()", "")
          .replace(/\u200B/g, "")
      )
      .get()
      .filter((functionName) => !fncExclusions.includes(functionName));

    allDocumentedFunctions.push(...functionNames);
  }

  // find undocumented functions
  const undocumentedFunctions = allExistingFunctions.filter(
    (existingFunction) => !allDocumentedFunctions.includes(existingFunction)
  );

  if (undocumentedFunctions.length > 0) {
    console.log("Undocumented functions:");
    for (const undocumentedFunction of undocumentedFunctions) {
      console.log(`* ${undocumentedFunction}`);
    }

    console.log("--------------------------------------------------");
  }

  // find removed functions (is documented but no longer exists)
  const removedFunctions = allDocumentedFunctions.filter(
    (documentedFunction) => !allExistingFunctions.includes(documentedFunction)
  );

  if (removedFunctions.length > 0) {
    console.log("Removed function that is currently documented:");
    for (const removedFunction of removedFunctions) {
      console.log(`* ${removedFunction}`);
    }
  }

  // exit with error code if there are undocumented functions
  if (undocumentedFunctions.length > 0) {
    process.exit(1);
  }
};

await detectMissingFunctions();
