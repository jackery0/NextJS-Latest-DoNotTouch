const http = require('http');

if (process.argv.length < 4) {
  console.error('Usage: node script.js <IP> <PORT>');
  process.exit(1);
}

const TARGET_IP = process.argv[2];
const TARGET_PORT = parseInt(process.argv[3]);

if (isNaN(TARGET_PORT) || TARGET_PORT < 1 || TARGET_PORT > 65535) {
  console.error('Invalid port number. Must be between 1 and 65535.');
  process.exit(1);
}

const dummyData = JSON.stringify({
  access_key_id: 'AAAAAAAAA',
  secret_access_key: 'AAAAAAAAA',
  session_token: 'AAAAAAAAA'
});

const options = {
  hostname: TARGET_IP,
  port: TARGET_PORT,
  path: '/aws-credentials',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(dummyData)
  }
};

let requestCount = 0;

function sendRequest() {
  const req = http.request(options, (res) => {
    requestCount++;
    console.log(`Request ${requestCount}: Response Code ${res.statusCode}`);
    res.resume();
  });

  req.on('error', (e) => {
    requestCount++;
    console.error(`Request ${requestCount}: Error - ${e.message}`);
  });

  req.write(dummyData);
  req.end();
}

console.log(`WARNING: This script will send a high volume of POST requests to ${TARGET_IP}:${TARGET_PORT}/aws-credentials`);
console.log('Ensure you have explicit permission to perform this test.');
console.log('Press Ctrl+C to stop the script.');

setInterval(sendRequest, 0);
