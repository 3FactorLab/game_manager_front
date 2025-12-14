#!/usr/bin/env node
/**
 * update-imports.js
 * Updates imports after context split
 *
 * Usage: node scripts/update-imports.js <contextName>
 * Example: node scripts/update-imports.js auth
 *
 * IMPORTANT: This script does NOT execute any git commands.
 * It only modifies import statements in files.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get context name from command line
const CONTEXT_NAME = process.argv[2];

if (!CONTEXT_NAME) {
  console.error("❌ Error: Context name required");
  console.log("Usage: node scripts/update-imports.js <contextName>");
  console.log("Example: node scripts/update-imports.js auth");
  process.exit(1);
}

const contextNameCapitalized =
  CONTEXT_NAME.charAt(0).toUpperCase() + CONTEXT_NAME.slice(1);

console.log(`🔄 Updating imports for ${contextNameCapitalized}Context...`);

// 1. Update main.tsx
const mainFile = path.join(__dirname, "..", "src", "main.tsx");
if (fs.existsSync(mainFile)) {
  let mainContent = fs.readFileSync(mainFile, "utf8");

  // Replace Provider import
  const oldImport = `from "./features/${CONTEXT_NAME}/${contextNameCapitalized}Context"`;
  const newImport = `from "./features/${CONTEXT_NAME}/${contextNameCapitalized}Provider"`;

  if (mainContent.includes(oldImport)) {
    mainContent = mainContent.replace(oldImport, newImport);
    fs.writeFileSync(mainFile, mainContent);
    console.log(`✅ Updated: main.tsx`);
  }
}

// 2. Update test files
const contextDir = path.join(__dirname, "..", "src", "features", CONTEXT_NAME);
const files = fs.readdirSync(contextDir);
const testFiles = files.filter((f) => f.endsWith(".test.tsx"));

testFiles.forEach((testFileName) => {
  const testFile = path.join(contextDir, testFileName);
  let content = fs.readFileSync(testFile, "utf8");

  // Check if file imports both Provider and Hook from Context
  const importRegex = new RegExp(
    `import\\s*{\\s*([^}]+)\\s*}\\s*from\\s*['"]\\.\\/${contextNameCapitalized}Context['"]`,
    "g"
  );

  const match = content.match(importRegex);
  if (match) {
    const importStatement = match[0];
    const imports = importStatement
      .match(/{([^}]+)}/)[1]
      .split(",")
      .map((i) => i.trim());

    const hasProvider = imports.some((i) => i.includes("Provider"));
    const hasHook = imports.some((i) => i.includes("use"));

    if (hasProvider && hasHook) {
      // Split imports
      const providerImports = imports.filter((i) => i.includes("Provider"));
      const hookImports = imports.filter((i) => !i.includes("Provider"));

      const newImports = [
        `import { ${providerImports.join(
          ", "
        )} } from "./${contextNameCapitalized}Provider";`,
        `import { ${hookImports.join(
          ", "
        )} } from "./${contextNameCapitalized}Context";`,
      ].join("\n");

      content = content.replace(importRegex, newImports);
      fs.writeFileSync(testFile, content);
      console.log(`✅ Updated: ${testFileName}`);
    }
  }
});

console.log(`\n🎉 Imports updated for ${contextNameCapitalized}Context!`);
console.log("\n📋 Next steps:");
console.log(`1. Run: npm test -- ${contextNameCapitalized}Context`);
console.log(`2. Verify in browser`);
