import { Glob } from "bun";
import * as cheerio from "cheerio";

const repositoryName = "surrealdb/surrealdb";
const branch = "main";

const detectMissingFunctions = async () => {
  console.log("Detecting missing functions...");
  console.log("--------------------------------------------------");

  const fuzzRawFilePath = "sdk/fuzz/fuzz_targets/fuzz_executor.dict";

  const response = await fetch(
    `https://raw.githubusercontent.com/${repositoryName}/${branch}/${fuzzRawFilePath}`
  );
  const result = await response.text();

  const allExistingFunctions = result
    .split("\n")
    .map((line) => line.replaceAll('"', ""))
    .filter((line) => line.endsWith("(") && line.includes("::"))
    .map((line) => line.replace("(", ""));

  const allDocumentedFunctions: string[] = [];

  const glob = new Glob(
    "../doc-surrealql_versioned_docs/version-latest/functions/database/*.mdx"
  );
  for await (const path of glob.scan(".")) {
    const data = await Bun.file(path).text();
    const $ = cheerio.load(data);

    const functionNames = $('td[data-label="Function"]')
      .map((_, el) => $(el).text().replace("()", "").replace(/\u200B/g, ""))
      .get();

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
};

await detectMissingFunctions();
