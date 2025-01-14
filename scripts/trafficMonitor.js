const net = require('net');

// Specify the ports you want to monitor
const portsToMonitor = [3000, 9898]; // Add or remove ports as needed

function monitorPort(port) {
  const server = net.createServer((socket) => {
    console.log(`${new Date().toISOString()} - Connection detected on port ${port} from ${socket.remoteAddress}:${socket.remotePort}`);
    
    socket.on('data', (data) => {
      console.log(`${new Date().toISOString()} - Data received on port ${port}:`);
      console.log(data.toString());
    });

    socket.on('end', () => {
      console.log(`${new Date().toISOString()} - Connection closed on port ${port}`);
    });

    // Immediately end the connection
    socket.end();
  });

  server.listen(port, () => {
    console.log(`Monitoring port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use. Unable to monitor.`);
    } else {
      console.error(`Error on port ${port}:`, err);
    }
  });
}

portsToMonitor.forEach(monitorPort);

console.log('Starting port monitoring...');
