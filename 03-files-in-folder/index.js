const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error folder reading:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error getting information about file ${file}:`, err);
        return;
      }

      if (stats.isFile()) {
        const fileName = path.parse(file).name;
        const fileExt = path.parse(file).ext;
        const fileSize = stats.size;

        console.log(`${fileName} - ${fileExt.slice(1)} - ${fileSize} bytes`);
      }
    });
  });
});