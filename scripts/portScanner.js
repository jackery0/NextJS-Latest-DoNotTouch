const net = require('net');

function scanPort(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(`Port ${port} is open`);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(`Port ${port} is closed or filtered`);
    });
    socket.on('error', () => {
      resolve(`Port ${port} is closed or filtered`);
    });
    socket.connect(port, host);
  });
}

async function portScan(host, startPort, endPort) {
  for (let port = startPort; port <= endPort; port++) {
    const result = await scanPort(host, port);
    console.log(result);
  }
}

const [,, host, startPort, endPort] = process.argv;

if (!host || !startPort || !endPort) {
  console.log('Usage: node portScanner.js <host> <startPort> <endPort>');
  process.exit(1);
}

portScan(host, parseInt(startPort), parseInt(endPort));
