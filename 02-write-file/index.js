
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Congratulation! Enter your information:');


const writeToOutputFile = (input) => {
  fs.appendFile(path.join(__dirname, 'info.txt'), input + '\n', (err) => {
    if (err) {
      console.error('Writing error:', err);
    } else {
      console.log('Information saved!');
    }
  });
};

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    writeToOutputFile(input);
  }
});

rl.on('close', () => {
  console.log('Bye!!! Come back soon');
});