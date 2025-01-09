const fs = require('fs');
const path = require('path');

function listProcesses() {
  const procDir = '/proc';
  fs.readdir(procDir, (err, files) => {
    if (err) throw err;
    
    files.forEach(file => {
      if (/^\d+$/.test(file)) {
        const cmdlinePath = path.join(procDir, file, 'cmdline');
        fs.readFile(cmdlinePath, 'utf8', (err, data) => {
          if (err) {
            // Skip if we can't read the file
            return;
          }
          console.log(`PID ${file}: ${data.replace(/\0/g, ' ').trim()}`);
        });
      }
    });
  });
}

listProcesses();
