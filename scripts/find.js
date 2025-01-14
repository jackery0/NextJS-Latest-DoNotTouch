const fs = require('fs');
const path = require('path');

function find(dir, pattern, type, visitedDirs = new Set()) {
    if (visitedDirs.has(dir)) {
        return; // Skip if we've already visited this directory
    }
    visitedDirs.add(dir);

    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (error) {
        console.error(`Error reading directory ${dir}: ${error.message}`);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(dir, file);
        let stat;
        try {
            stat = fs.lstatSync(filePath); // Use lstatSync to handle symlinks
        } catch (error) {
            console.error(`Error accessing ${filePath}: ${error.message}`);
            return;
        }

        if (stat.isSymbolicLink()) {
            return; // Skip symlinks to avoid potential loops
        }

        if (stat.isDirectory()) {
            find(filePath, pattern, type, visitedDirs);
        } else if (!type || (type === 'd' && stat.isDirectory()) || (type === 'f' && stat.isFile())) {
            if (!pattern || file.match(pattern)) {
                console.log(filePath);
            }
        }
    });
}

const args = process.argv.slice(2);
const startPath = args[0] || '.';
let pattern, type;

args.forEach((arg, index) => {
    if (arg === '-name' && args[index + 1]) {
        pattern = new RegExp(args[index + 1].replace(/\*/g, '.*'));
    } else if (arg === '-type' && args[index + 1]) {
        type = args[index + 1];
    }
});

find(startPath, pattern, type);
