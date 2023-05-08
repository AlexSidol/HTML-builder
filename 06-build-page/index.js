const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const indexFile = path.join(distDir, 'index.html');
const styleFile = path.join(distDir, 'style.css');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(distDir, 'assets');


if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}


const copyAssets = () => {
  if (!fs.existsSync(distAssetsDir)) {
    fs.mkdirSync(distAssetsDir);
  }

  const files = fs.readdirSync(assetsDir);
  files.forEach((file) => {
    const sourcePath = path.join(assetsDir, file);
    const destinationPath = path.join(distAssetsDir, file);

    const stats = fs.statSync(sourcePath);

    if (stats.isFile()) {
      fs.copyFileSync(sourcePath, destinationPath);
    } else if (stats.isDirectory()) {
      copyDir(sourcePath, destinationPath);
    }
  });

  console.log('Folder assets successfuly copied to folder project-dist.');
};


const replaceTags = (content, componentName, componentContent) => {
  const regex = new RegExp(`{{${componentName}}}`, 'g');
  return content.replace(regex, componentContent);
};


const mergeStyles = () => {
  const files = fs.readdirSync(stylesDir);
  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  const content = cssFiles
    .map((file) => {
      const filePath = path.join(stylesDir, file);
      return fs.readFileSync(filePath, 'utf8');
    })
    .join('\n');

  fs.writeFileSync(styleFile, content, 'utf8');

  console.log('Styles successfuly bundled into file style.css');
};


const copyDir = (source, destination) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    const stats = fs.statSync(sourcePath);

    if (stats.isFile()) {
      fs.copyFileSync(sourcePath, destinationPath);
    } else if (stats.isDirectory()) {
      copyDir(sourcePath, destinationPath);
    }
  });
};


const buildPage = () => {

  const templateContent = fs.readFileSync(templateFile, 'utf8');

  const componentFiles = fs.readdirSync(componentsDir);
  let outputContent = templateContent;

  componentFiles.forEach((file) => {
    const componentName = path.parse(file).name;
    const componentPath = path.join(componentsDir, file);
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    outputContent = replaceTags(outputContent, componentName, componentContent);
  });


  fs.writeFileSync(indexFile, outputContent, 'utf8');
  console.log('File index.html successfuly bundled');


  mergeStyles();

  copyAssets();

  console.log('Page bundle successfuly finished.');
};

buildPage();

