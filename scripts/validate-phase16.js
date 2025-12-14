#!/usr/bin/env node
/**
 * validate-phase16.js
 * Validates that Phase 16 refactor was done correctly
 *
 * Usage: node scripts/validate-phase16.js
 * Or: npm run validate:phase16
 *
 * IMPORTANT: This script does NOT execute any git commands.
 * It only validates the current state of the code.
 */

import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = [
  checkNoMixedExports,
  checkImportsUpdated,
  checkTestsPass,
  checkTypeScriptCompiles,
  checkNoDuplicateContext,
];

/**
 * Verifies that no file exports both Provider and Hook
 */
async function checkNoMixedExports() {
  const contexts = ["auth", "cart", "wishlist"];

  for (const ctx of contexts) {
    const contextName = ctx.charAt(0).toUpperCase() + ctx.slice(1);
    const contextFile = path.join(
      __dirname,
      "..",
      "src",
      "features",
      ctx,
      `${contextName}Context.tsx`
    );

    if (!fs.existsSync(contextFile)) {
      return { passed: false, error: `${contextName}Context.tsx not found` };
    }

    const content = fs.readFileSync(contextFile, "utf8");

    const hasProvider = content.includes(`export const ${contextName}Provider`);
    const hasHook = content.includes(`export const use${contextName}`);

    if (hasProvider && hasHook) {
      return {
        passed: false,
        error: `${contextName}Context.tsx exports both Provider and Hook (should be separated)`,
      };
    }

    // Verify Provider file exists
    const providerFile = path.join(
      __dirname,
      "..",
      "src",
      "features",
      ctx,
      `${contextName}Provider.tsx`
    );
    if (!fs.existsSync(providerFile)) {
      return { passed: false, error: `${contextName}Provider.tsx not found` };
    }
  }

  return { passed: true };
}

/**
 * Verifies that main.tsx imports from Provider files
 */
async function checkImportsUpdated() {
  const mainFile = path.join(__dirname, "..", "src", "main.tsx");
  const content = fs.readFileSync(mainFile, "utf8");

  const contexts = ["Auth", "Cart", "Wishlist"];

  for (const ctx of contexts) {
    const oldImport = `from "./features/${ctx.toLowerCase()}/${ctx}Context"`;
    const newImport = `from "./features/${ctx.toLowerCase()}/${ctx}Provider"`;

    if (content.includes(oldImport)) {
      return {
        passed: false,
        error: `main.tsx still imports ${ctx}Provider from ${ctx}Context (should be from ${ctx}Provider)`,
      };
    }

    if (!content.includes(newImport)) {
      return {
        passed: false,
        error: `main.tsx doesn't import ${ctx}Provider from ${ctx}Provider`,
      };
    }
  }

  return { passed: true };
}

/**
 * Verifies that all tests pass
 */
async function checkTestsPass() {
  try {
    execSync("npm test -- --run", {
      stdio: "pipe",
      cwd: path.join(__dirname, ".."),
    });
    return { passed: true };
  } catch (error) {
    return { passed: false, error: "Tests failed" };
  }
}

/**
 * Verifies that TypeScript compiles without errors
 */
async function checkTypeScriptCompiles() {
  try {
    execSync("npx tsc --noEmit", {
      stdio: "pipe",
      cwd: path.join(__dirname, ".."),
    });
    return { passed: true };
  } catch (error) {
    return { passed: false, error: "TypeScript compilation failed" };
  }
}

/**
 * Verifies that no backup files exist
 */
async function checkNoDuplicateContext() {
  try {
    const backups = execSync('find src/features -name "*.backup"', {
      cwd: path.join(__dirname, ".."),
      encoding: "utf8",
    });

    if (backups.trim()) {
      return {
        passed: false,
        error: `Backup files still exist:\n${backups}`,
      };
    }

    return { passed: true };
  } catch (error) {
    // No backups found (find returns error if no matches)
    return { passed: true };
  }
}

/**
 * Main validation function
 */
async function validate() {
  console.log("🔍 Validating Phase 16 refactor...\n");

  let allPassed = true;

  for (const check of checks) {
    process.stdout.write(`  ${check.name}... `);
    const result = await check();

    if (!result.passed) {
      console.log("❌\n");
      console.log(`Error: ${result.error}\n`);
      allPassed = false;
    } else {
      console.log("✅");
    }
  }

  if (allPassed) {
    console.log("\n✅ All validations passed!");
    console.log("\n🎉 Phase 16 refactor is complete and correct!");
    process.exit(0);
  } else {
    console.log("\n❌ Some validations failed. Please fix the errors above.");
    process.exit(1);
  }
}

// Run validation
validate();
