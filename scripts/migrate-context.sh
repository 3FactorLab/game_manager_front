#!/bin/bash
# migrate-context.sh
# Automatiza la migración completa de un context
# NOTA: NO hace commits automáticos - tú tienes control total

CONTEXT_NAME=$1

if [ -z "$CONTEXT_NAME" ]; then
  echo "❌ Error: Context name required"
  echo "Usage: ./scripts/migrate-context.sh <contextName>"
  echo "Example: ./scripts/migrate-context.sh auth"
  exit 1
fi

echo "🔄 Migrating $CONTEXT_NAME context..."

# 1. Split context
node scripts/split-context.js $CONTEXT_NAME
if [ $? -ne 0 ]; then
  echo "❌ Failed to split context"
  exit 1
fi

# 2. Update imports
node scripts/update-imports.js $CONTEXT_NAME
if [ $? -ne 0 ]; then
  echo "❌ Failed to update imports"
  exit 1
fi

# 3. Run tests
npm test -- $CONTEXT_NAME

# 4. Report results
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration successful!"
  echo ""
  echo "📋 Next steps:"
  echo "1. Review the changes"
  echo "2. Test in browser"
  echo "3. When ready, commit manually:"
  echo "   git add ."
  echo "   git commit -m \"refactor: separate $CONTEXT_NAME Provider from hook\""
else
  echo ""
  echo "❌ Tests failed!"
  echo "Review errors and fix before committing"
  exit 1
fi
