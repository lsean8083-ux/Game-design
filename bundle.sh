#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Bundling project for distribution..."

# Remove the dist directory if it exists
if [ -d "dist" ]; then
  echo "Removing existing dist directory."
  rm -rf dist
fi

# Create a fresh dist directory
echo "Creating dist directory."
mkdir -p dist/src

# Copy assets, excluding .DS_Store files
echo "Copying assets (excluding .DS_Store)..."
rsync -av --exclude '.DS_Store' assets/ dist/assets/

# Copy index.html
echo "Copying index.html..."
cp index.html dist/

# Check for Node.js to enable minification and bundling
if command -v node &> /dev/null
then
  echo "Node.js detected. Bundling and minifying JavaScript with esbuild."
  # Define a specific esbuild version for reproducibility
  ESBUILD_VERSION="0.20.2"
  
  # esbuild will bundle src/main.js and all its imported dependencies into a single file
  npx esbuild@${ESBUILD_VERSION} src/main.js --bundle --outfile=dist/src/main.js --minify
  
  echo "JavaScript successfully bundled into dist/src/main.js."
else
  echo "Node.js not found. Skipping JavaScript bundling and minification."
  echo "Copying src files as-is (excluding types folder and .DS_Store)..."
  # If Node.js is not present, copy the src folder structure so the browser can load modules
  rsync -av --exclude 'types/' --exclude '.DS_Store' src/ dist/src/
fi

echo "Project successfully bundled in the 'dist' directory."
