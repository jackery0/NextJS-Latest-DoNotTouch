const net = require('net');

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(100);  // 100ms timeout
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

async function scanPorts(startPort, endPort, concurrency = 100) {
  const openPorts = [];
  for (let i = startPort; i <= endPort; i += concurrency) {
    const endIndex = Math.min(i + concurrency - 1, endPort);
    const portRange = Array.from({length: endIndex - i + 1}, (_, index) => index + i);
    const results = await Promise.all(portRange.map(port => checkPort(port)));
    results.forEach((isOpen, index) => {
      if (isOpen) openPorts.push(i + index);
    });
  }
  return openPorts;
}

async function fastNetstatJs() {
  console.time('Port scan duration');
  const openPorts = await scanPorts(1, 10000);  // Scan first 10000 ports
  console.timeEnd('Port scan duration');
  console.log('Open ports:', openPorts.join(', '));
}

fastNetstatJs();
