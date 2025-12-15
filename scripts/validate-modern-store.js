import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const filesToCheck = [
  "src/features/home/components/DealSection.tsx",
  "src/features/home/components/DealSection.module.css",
  "src/features/home/components/DealSection.test.tsx",
];

console.log("🧪 Starting VDD: Modern Store Frontend Validation...");

let hasError = false;

// 1. File Integrity
filesToCheck.forEach((file) => {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    console.error(`❌ Missing file: ${file}`);
    hasError = true;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

if (hasError) process.exit(1);

// 2. Code Quality (Forbidden Patterns)
const content = fs.readFileSync(
  "src/features/home/components/DealSection.tsx",
  "utf8"
);
if (content.includes("console.log")) {
  console.error("❌ Forbidden: console.log found in DealSection.tsx");
  hasError = true;
}
if (content.includes("style={{")) {
  console.warn("⚠️  Warning: Inline styles detected. Prefer CSS modules.");
}

// 3. Run Tests
console.log("   🏃 Running Tests...");
try {
  execSync("npx vitest run src/features/home/components/DealSection.test.tsx", {
    stdio: "inherit",
  });
  console.log("✅ Tests Passed.");
} catch (e) {
  console.error("❌ Tests Failed.");
  process.exit(1);
}

console.log("✨ Frontend VDD Passed.");
