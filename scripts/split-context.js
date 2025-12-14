#!/usr/bin/env node
/**
 * split-context.js
 * Automatically splits a unified Context file into Context.tsx and Provider.tsx
 *
 * Usage: node scripts/split-context.js <contextName>
 * Example: node scripts/split-context.js auth
 *
 * IMPORTANT: This script does NOT execute any git commands.
 * It only modifies files locally. You decide when to commit.
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
  console.log("Usage: node scripts/split-context.js <contextName>");
  console.log("Example: node scripts/split-context.js auth");
  process.exit(1);
}

const contextNameCapitalized =
  CONTEXT_NAME.charAt(0).toUpperCase() + CONTEXT_NAME.slice(1);
const contextDir = path.join(__dirname, "..", "src", "features", CONTEXT_NAME);
const originalFile = path.join(
  contextDir,
  `${contextNameCapitalized}Context.tsx`
);

console.log(`🔄 Splitting ${contextNameCapitalized}Context...`);

// 1. Read original file
if (!fs.existsSync(originalFile)) {
  console.error(`❌ File not found: ${originalFile}`);
  process.exit(1);
}

const content = fs.readFileSync(originalFile, "utf8");
const lines = content.split("\n");

// 2. Find Provider component boundaries
const providerStartIndex = lines.findIndex((line) =>
  line.includes(`export const ${contextNameCapitalized}Provider`)
);

if (providerStartIndex === -1) {
  console.error(`❌ Could not find ${contextNameCapitalized}Provider in file`);
  process.exit(1);
}

// Find the end of Provider component (closing brace + semicolon)
let providerEndIndex = -1;
let braceCount = 0;
let foundOpenBrace = false;

for (let i = providerStartIndex; i < lines.length; i++) {
  const line = lines[i];

  // Count braces
  for (const char of line) {
    if (char === "{") {
      braceCount++;
      foundOpenBrace = true;
    } else if (char === "}") {
      braceCount--;
    }
  }

  // Found closing of Provider
  if (foundOpenBrace && braceCount === 0 && line.includes("};")) {
    providerEndIndex = i;
    break;
  }
}

if (providerEndIndex === -1) {
  console.error("❌ Could not find end of Provider component");
  process.exit(1);
}

// 3. Create Context.tsx content (everything except Provider)
const contextLines = [
  ...lines.slice(0, providerStartIndex),
  ...lines.slice(providerEndIndex + 1),
];

// Remove trailing empty lines
while (
  contextLines.length > 0 &&
  contextLines[contextLines.length - 1].trim() === ""
) {
  contextLines.pop();
}

const contextContent = contextLines.join("\n") + "\n";

// 4. Create Provider.tsx content
const providerImports = [];
const importEndIndex = lines.findIndex(
  (line, idx) =>
    idx > 0 &&
    !line.startsWith("import") &&
    !line.startsWith("/**") &&
    !line.startsWith(" *") &&
    !line.startsWith(" */") &&
    line.trim() !== ""
);

// Get necessary imports
for (let i = 0; i < importEndIndex; i++) {
  const line = lines[i];
  if (
    line.includes("import") &&
    (line.includes("useState") ||
      line.includes("useEffect") ||
      line.includes("ReactNode") ||
      line.includes("type"))
  ) {
    providerImports.push(line);
  }
}

const providerLines = [
  "/**",
  ` * ${contextNameCapitalized}Provider.tsx`,
  ` * ${contextNameCapitalized} provider component.`,
  ` * Manages global ${CONTEXT_NAME} state and provides it via ${contextNameCapitalized}Context.`,
  " */",
  ...providerImports,
  `import { ${contextNameCapitalized}Context } from "./${contextNameCapitalized}Context";`,
  ...lines
    .slice(importEndIndex, providerStartIndex)
    .filter((line) => !line.includes("createContext") && line.trim() !== ""),
  "",
  ...lines.slice(providerStartIndex, providerEndIndex + 1),
  "",
];

const providerContent = providerLines.join("\n");

// 5. Create backup of original file
const backupFile = originalFile + ".backup";
fs.copyFileSync(originalFile, backupFile);
console.log(`✅ Backup created: ${path.basename(backupFile)}`);

// 6. Write new files
const newContextFile = path.join(
  contextDir,
  `${contextNameCapitalized}Context.tsx`
);
const newProviderFile = path.join(
  contextDir,
  `${contextNameCapitalized}Provider.tsx`
);

fs.writeFileSync(newContextFile, contextContent);
console.log(`✅ Created: ${contextNameCapitalized}Context.tsx`);

fs.writeFileSync(newProviderFile, providerContent);
console.log(`✅ Created: ${contextNameCapitalized}Provider.tsx`);

console.log(`\n🎉 ${contextNameCapitalized}Context split successfully!`);
console.log("\n📋 Next steps:");
console.log(`1. Review the generated files`);
console.log(`2. Run: node scripts/update-imports.js ${CONTEXT_NAME}`);
console.log(`3. Run: npm test -- ${contextNameCapitalized}Context`);
