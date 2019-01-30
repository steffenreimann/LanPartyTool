const fs = require('fs');
const os = require('os');
const path = require('path');
const aes = require('../utils/aesEncrypt');


let homeDir = '';
let baseDir = 'LanToolConfigs';
const userCfgName = 'user.cfg';
let userCfg = null;
let userCfgPath = '';


function init() {
    homeDir = os.homedir();
    baseDir = path.join(homeDir, baseDir);
    userCfgPath = path.join(baseDir, userCfgName);
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
function loadUserConfig(pwd) {
    const result = {fileExists: false, parseError: true, userCfg: null};
    if (!fs.existsSync(userCfgPath)) {
        return result;
    }
    result.fileExists = true;
    const raw = fs.readFileSync(userCfgPath);

    let decrypted = aes.DecryptBuffer(pwd, raw);
    decrypted = decrypted.toString('utf8');
    let jsonObj = null;
    try {
        jsonObj = JSON.parse(decrypted);
    } catch (e) {
        console.error('Could not parse UserConfig from file');
        return result;
    }
    result.parseError = false;
    userCfg = jsonObj;
    result.userCfg = userCfg;
    return result;
}

/**
 * Encrypts UserConfig Object with password and writes encrypted data to UserConfig file
 * @param pwd {string} Password from user
 * @param userCfgObj {Object}
 * @returns {boolean}
 */
function writeUserConfig(pwd, userCfgObj) {
    const jsonText = JSON.stringify(userCfgObj);
    const jsonBytes = new Buffer(jsonText, 'utf8');
    const encrypted = aes.EncryptBuffer(pwd, jsonBytes);
    try {
        fs.writeFileSync(userCfgPath, encrypted);
        return true;
    } catch (e) {
        console.error('Could not write UserConfig');
        return false;
    }
}

module.exports = {
    Init: init,
    InitDirs: initDirs,
    GetBaseDir: getHomeDir,
    GetUserCfg: getUserCfg,
    LoadUserConfig: loadUserConfig,
    WriteUserConfig: writeUserConfig,
};







