/**
 * Component Migration Helper Script
 * 
 * This script helps migrate components from the legacy structure to the feature-based structure.
 * Usage: node scripts/migrate-component.js <source-path> <target-feature-path>
 * 
 * Example: node scripts/migrate-component.js src/pages/ForgotPassword/ForgotPassword.tsx src/features/auth/forgot-password/ForgotPasswordPage.tsx
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get command line arguments
const [, , sourcePath, targetPath] = process.argv;

if (!sourcePath || !targetPath) {
  console.error('Usage: node scripts/migrate-component.js <source-path> <target-feature-path>');
  process.exit(1);
}

// Make sure the source file exists
if (!fs.existsSync(sourcePath)) {
  console.error(`Source file ${sourcePath} does not exist.`);
  process.exit(1);
}

// Create target directory if it doesn't exist
const targetDir = path.dirname(targetPath);
if (!fs.existsSync(targetDir)) {
  console.log(`Creating directory ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });
}

// Read the source file
const sourceContent = fs.readFileSync(sourcePath, 'utf8');

// Update import paths to reflect the new location
const targetContent = updateImportPaths(sourceContent, sourcePath, targetPath);

// Write the target file
fs.writeFileSync(targetPath, targetContent);
console.log(`Migrated ${sourcePath} to ${targetPath}`);

// Check if there are CSS modules to migrate
const sourceDir = path.dirname(sourcePath);
const sourceBasename = path.basename(sourcePath, path.extname(sourcePath));
const cssFiles = fs.readdirSync(sourceDir).filter(file => 
  file.startsWith(sourceBasename) && 
  (file.endsWith('.module.css') || file.endsWith('.module.scss'))
);

// Migrate CSS modules if they exist
if (cssFiles.length > 0) {
  cssFiles.forEach(cssFile => {
    const sourceCssPath = path.join(sourceDir, cssFile);
    const targetCssPath = path.join(
      targetDir, 
      cssFile.replace(sourceBasename, path.basename(targetPath, path.extname(targetPath)))
    );
    
    fs.copyFileSync(sourceCssPath, targetCssPath);
    console.log(`Migrated CSS module ${sourceCssPath} to ${targetCssPath}`);
  });
}

// Helper function to update import paths
function updateImportPaths(content, sourcePath, targetPath) {
  const sourceDir = path.dirname(sourcePath);
  const targetDir = path.dirname(targetPath);
  
  // Calculate the relative path difference
  const pathDifference = path.relative(targetDir, sourceDir);
  
  // Replace import paths in the content
  let updatedContent = content;
  
  // Extract all import statements
  const importRegex = /import\s+(?:(?:\{[^}]*\})|(?:[^{}\s,]+))?\s*(?:,\s*(?:\{[^}]*\})|(?:[^{}\s,]+))?\s*from\s+['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Only update relative paths
    if (importPath.startsWith('.')) {
      // Calculate the new path
      const absoluteImportPath = path.resolve(sourceDir, importPath);
      const newRelativeImportPath = path.relative(targetDir, absoluteImportPath);
      
      // Make sure we have a leading ./ or ../
      const formattedPath = newRelativeImportPath.startsWith('.') 
        ? newRelativeImportPath 
        : `./${newRelativeImportPath}`;
      
      // Replace the path in the content
      updatedContent = updatedContent.replace(
        new RegExp(`from\\s+['"]${importPath.replace(/\./g, '\\.')}['"]`, 'g'), 
        `from '${formattedPath}'`
      );
    }
  }
  
  return updatedContent;
} 