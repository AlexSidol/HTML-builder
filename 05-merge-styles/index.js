const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(distDir, 'bundle.css');

function mergeStyles(stylesDir, outputFile) {
  const files = fs.readdirSync(stylesDir);

  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  const content = cssFiles
    .map((file) => {
      const filePath = path.join(stylesDir, file);
      return fs.readFileSync(filePath, 'utf8');
    })
    .join('\n');

  fs.writeFileSync(outputFile, content, 'utf8');

  console.log('Styles successfuly bundled into file bundle.css');
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

mergeStyles(stylesDir, outputFile);