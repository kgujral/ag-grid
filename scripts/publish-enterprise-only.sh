#!/bin/bash

# Script to publish only ag-grid-enterprise as kg-grid-enterprise to personal npm registry
# Usage: ./scripts/publish-enterprise-only.sh [registry-url]

REGISTRY_URL=${1:-"https://registry.npmjs.org/"}
NEW_PACKAGE_NAME="@sixsprints/kg-grid-enterprise"

echo "Publishing ag-grid-enterprise as $NEW_PACKAGE_NAME to registry: $REGISTRY_URL"

# Build the enterprise package first
echo "Building ag-grid-enterprise package..."
nx run ag-grid-enterprise:build

# Navigate to the enterprise package directory
cd packages/ag-grid-enterprise

echo "Publishing $NEW_PACKAGE_NAME..."

# Create a backup of the original package.json
cp package.json package.json.backup

# Update package.json with new name and registry
node -e "
const pkg = require('./package.json');
pkg.name = '$NEW_PACKAGE_NAME';
pkg.publishConfig = pkg.publishConfig || {};
pkg.publishConfig.registry = '$REGISTRY_URL';
require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
"

# Publish the package
npm publish --registry "$REGISTRY_URL"

# Restore the original package.json
mv package.json.backup package.json

cd - > /dev/null

echo "Successfully published $NEW_PACKAGE_NAME to $REGISTRY_URL"