const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

function copyDir(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  const files = fs.readdirSync(destination);
  files.forEach((file) => {
    const filePath = path.join(destination, file);
    fs.unlinkSync(filePath);
  });

  const sourceFiles = fs.readdirSync(source);
  sourceFiles.forEach((file) => {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    const stats = fs.statSync(sourcePath);

    if (stats.isFile()) {
      const readStream = fs.createReadStream(sourcePath);
      const writeStream = fs.createWriteStream(destinationPath);

      readStream.pipe(writeStream);
    } else if (stats.isDirectory()) {
      copyDir(sourcePath, destinationPath);
    }
  });
}

// Обработчик события удаления файлов из папки files
fs.watch(sourceDir, (eventType, filename) => {
  if (eventType === 'rename') {
    const sourcePath = path.join(sourceDir, filename);
    const destinationPath = path.join(destinationDir, filename);

    if (fs.existsSync(sourcePath)) {
      const stats = fs.statSync(sourcePath);

      if (stats.isFile()) {
        const readStream = fs.createReadStream(sourcePath);
        const writeStream = fs.createWriteStream(destinationPath);

        readStream.pipe(writeStream);

        console.log(`File ${filename} copied to folder files-copy.`);
      } else if (stats.isDirectory()) {
        copyDir(sourcePath, destinationPath);

        console.log(`Folder ${filename} copied to folder files-copy.`);
      }
    } else {
      const filePath = path.join(destinationDir, filename);
      fs.unlinkSync(filePath);

      console.log(`File ${filename} deleted from folder files-copy.`);
    }
  }
});

copyDir(sourceDir, destinationDir);

console.log('Folder files successfuly coped to files-copy.');
