const express = require('express');
const startSocketServer = require('./socket/startSocketServer');
const {startWatchingFile, readLastLines} = require('./watchFile');


const startHttpSever = async () => {
  const app = express();

  server = require('http').createServer(app).listen(8080, () => {
    console.log(`server listening on port 8080`);
  });

  return server;
}

startHttpSever()
  .then(async (server) => {
    startWatchingFile();
    const lastLines = await readLastLines();
    startSocketServer(server, lastLines);
  })