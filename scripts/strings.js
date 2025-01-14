const fs = require('fs');

function isAsciiPrintable(char) {
    return char >= 32 && char <= 126;
}

function strings(filePath, minLength = 4) {
    const chunkSize = 4096;
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(chunkSize);
    let bytesRead;
    let currentString = '';

    while ((bytesRead = fs.readSync(fd, buffer, 0, chunkSize, null)) !== 0) {
        for (let i = 0; i < bytesRead; i++) {
            if (isAsciiPrintable(buffer[i])) {
                currentString += String.fromCharCode(buffer[i]);
            } else {
                if (currentString.length >= minLength) {
                    console.log(currentString);
                }
                currentString = '';
            }
        }
    }

    // Print the last string if it meets the length requirement
    if (currentString.length >= minLength) {
        console.log(currentString);
    }

    fs.closeSync(fd);
}

// Check if a file path is provided
if (process.argv.length < 3) {
    console.log('Usage: node strings.js <file_path> [min_length]');
    process.exit(1);
}

const filePath = process.argv[2];
const minLength = process.argv[3] ? parseInt(process.argv[3]) : 4;

strings(filePath, minLength);