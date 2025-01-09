const https = require('https');
const http = require('http');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', (err) => {
      reject(`Error: ${err.message}`);
    });
  });
}

async function testEndpoints(endpoints) {
  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(endpoint);
      console.log(`${endpoint}:`);
      console.log(`Status: ${result.status}`);
      console.log('Headers:', JSON.stringify(result.headers, null, 2));
      console.log('Body:');
      console.log(result.body);
      console.log('\n');
    } catch (error) {
      console.log(`${endpoint}:\n${error}\n`);
    }
  }
}

const [,, ...endpoints] = process.argv;

if (endpoints.length === 0) {
  console.log('Usage: node httpTester.js <url1> <url2> ...');
  process.exit(1);
}

testEndpoints(endpoints);
