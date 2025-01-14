const net = require('net');

const startIp = '169.254.79.0';  // Replace with your actual start IP
const endIp = '169.254.79.254';  // Replace with your actual end IP
const port = 80;  // You can change this to any port you want to scan
const timeout = 1000;  // Timeout in milliseconds

function ipToLong(ip) {
    return ip.split('.').reduce((total, part) => total * 256 + parseInt(part), 0);
}

function longToIp(long) {
    return [long >>> 24, (long >> 16) & 255, (long >> 8) & 255, long & 255].join('.');
}

function checkHost(ip) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(timeout);

        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });

        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });

        socket.connect(port, ip);
    });
}

async function scanRange() {
    const startLong = ipToLong(startIp);
    const endLong = ipToLong(endIp);

    console.log(`Scanning IP range from ${startIp} to ${endIp} on port ${port}`);

    for (let i = startLong; i <= endLong; i++) {
        const ip = longToIp(i);
        const isAlive = await checkHost(ip);
        if (isAlive) {
            console.log(`Host responding at ${ip}`);
        }
    }

    console.log('Scan complete');
}

scanRange();
