const os = require('os');
const networkInterfaces = os.networkInterfaces();

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

for (let interfaceName in networkInterfaces) {
    console.log(`${interfaceName}:`);
    networkInterfaces[interfaceName].forEach((interface, index) => {
        console.log(`  ${interface.family}:`);
        console.log(`    Address: ${interface.address}`);
        console.log(`    Netmask: ${interface.netmask}`);
        if (interface.mac) {
            console.log(`    MAC Address: ${interface.mac}`);
        }
        console.log(`    Internal: ${interface.internal}`);
        if (interface.cidr) {
            console.log(`    CIDR: ${interface.cidr}`);
        }
        if (os.type() === 'Linux') {
            try {
                const stats = require('fs').statSync(`/sys/class/net/${interfaceName}/statistics`);
                const rxBytes = parseInt(require('fs').readFileSync(`/sys/class/net/${interfaceName}/statistics/rx_bytes`).toString());
                const txBytes = parseInt(require('fs').readFileSync(`/sys/class/net/${interfaceName}/statistics/tx_bytes`).toString());
                console.log(`    RX bytes: ${formatBytes(rxBytes)}`);
                console.log(`    TX bytes: ${formatBytes(txBytes)}`);
            } catch (err) {
                // If we can't read the statistics, just skip them
            }
        }
        console.log('');
    });
}
