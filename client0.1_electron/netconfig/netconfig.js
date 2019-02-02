const fs = require('fs');
const os = require('os');
const path = require('path');
const aes = require('../utils/aesEncrypt');


let homeDir = '';
let baseDir = 'LanToolConfigs';
const userNetCfgName = 'userNet.cfg';
let userNetCfg = null;
let userNetCfgPath = '';


function init() {
    homeDir = os.homedir();
    baseDir = path.join(homeDir, baseDir);
    userNetCfgPath = path.join(baseDir, userNetCfgName);
    return fs.existsSync(baseDir);
}

function initDirs() {
    fs.mkdirSync(baseDir);
}

function getHomeDir() {
    return baseDir;
}

function getUserCfg() {
    return userCfg;
}

/**
 * Loads encrypted UserConfig file decrypts it and returns it as javascript object
 * @param pwd {string} Password from user
 * @returns {Object} {fileExists: false, parseError: false, userCfg: null};
 */
function loadUserNetConfig(pwd) {
    const result = {fileExists: false, parseError: true, userNetCfg: null};
    if (!fs.existsSync(userNetCfgPath)) {
        return result;
    }
    result.fileExists = true;
    const raw = fs.readFileSync(userNetCfgPath);

    let decrypted = aes.DecryptBuffer(pwd, raw);
    decrypted = decrypted.toString('utf8');
    let jsonObj = null;
    try {
        jsonObj = JSON.parse(decrypted);
    } catch (e) {
        console.error('Could not parse UserNetConfig from file');
        return result;
    }
    result.parseError = false;
    userNetCfg = jsonObj;
    result.userNetCfg = userNetCfg;
    return result;
}

/**
 * Encrypts UserConfig Object with password and writes encrypted data to UserConfig file
 * @param pwd {string} Password from user
 * @param userNetCfgObj {Object}
 * @returns {boolean}
 */
function writeUserNetConfig(pwd, userNetCfgObj) {
    const jsonText = JSON.stringify(userNetCfgObj);
    const jsonBytes = new Buffer(jsonText, 'utf8');
    const encrypted = aes.EncryptBuffer(pwd, jsonBytes);
    try {
        fs.writeFileSync(userNetCfgPath, encrypted);
        return true;
    } catch (e) {
        console.error('Could not write UserNetConfig');
        return false;
    }
}

module.exports = {
    Init: init,
    InitDirs: initDirs,
    GetBaseDir: getHomeDir,
    GetUserCfg: getUserCfg,
    LoadUserNetConfig: loadUserNetConfig,
    WriteUserNetConfig: writeUserNetConfig,
};







