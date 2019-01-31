const fs = require('fs');
const aes = require('../utils/aesEncrypt');
const cfgPaths = require('./configPaths');

let userCfg = null;

function init() {
    return cfgPaths.Init();
}

function initDirs() {
    fs.mkdirSync(cfgPaths.GetBaseDir());
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
    if (!fs.existsSync(cfgPaths.GetUserCfgPath())) {
        return result;
    }
    result.fileExists = true;
    const raw = fs.readFileSync(cfgPaths.GetUserCfgPath());

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
        fs.writeFileSync(cfgPaths.GetUserCfgPath(), encrypted);
        return true;
    } catch (e) {
        console.error('Could not write UserConfig');
        return false;
    }
}

module.exports = {
    Init: init,
    InitDirs: initDirs,
    GetUserCfg: getUserCfg,
    LoadUserConfig: loadUserConfig,
    WriteUserConfig: writeUserConfig,
};







