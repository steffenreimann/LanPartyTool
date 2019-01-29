const fs = require('fs');
const os = require('os');
const path = require('path');


let homeDir = '';
let baseDir = 'LanToolConfigs';

function init() {
    homeDir = os.homedir();
    baseDir = path.join(homeDir, baseDir);
    return fs.existsSync(baseDir);
}

function initDirs() {
    fs.mkdirSync(baseDir);
}

function getHomeDir() {
    return baseDir;
}

module.exports = {
    Init: init,
    InitDirs: initDirs,
    GetBaseDir: getHomeDir
};







