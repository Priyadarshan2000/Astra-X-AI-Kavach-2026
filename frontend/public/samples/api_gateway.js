// api_gateway.js — insecure Node gateway (lab sample)
const { exec } = require('child_process');

function renderBanner(userInput) {
  document.getElementById('banner').innerHTML = userInput;
  document.write(userInput);
}

function runProbe(host) {
  exec('ping -c 1 ' + host);
}

function loadConfig(raw) {
  return eval('(' + raw + ')');
}

async function findOperator(db, id) {
  return db.query(`SELECT * FROM operators WHERE id=${id}`);
}
