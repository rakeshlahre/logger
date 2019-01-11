const fs = require('fs');
const path = require('path');
const readLine = require('readline');
const {socketEmitter} = require('./evenEmitter')

const file = path.join(__dirname, 'logger.txt');

const startWatchingFile = () => {
  fs.watch(file, 'utf8', function(eventType, fileName) {
    if (eventType === 'change') {
      let stringArr = [];

      let lineReader = readLine.createInterface({ input: fs.createReadStream(file) });
      lineReader.on('line', (line) => {
        stringArr.push(line);
      });
  
      lineReader.on('close', () => {
        if (stringArr.length <= 10) {
          socketEmitter.emit('emit_last_some_lines', stringArr);
        } else {
          socketEmitter.emit('emit_last_some_lines', stringArr.slice(stringArr.length - 10, stringArr.length));
        }
      });
    }
  });
}

const readLastLines = () => {
  return new Promise((resolve, reject) => {
    let stringArr = [];

    let lineReader = readLine.createInterface({ input: fs.createReadStream(file) });
    lineReader.on('line', (line) => {
      stringArr.push(line);
    });
  
    lineReader.on('close', () => {
      if (stringArr.length <= 10) {
        resolve(stringArr)
      } else {
        resolve(stringArr.slice(stringArr.length - 10, stringArr.length));
      }
    });
  })
}

module.exports = {startWatchingFile, readLastLines};

