/*
 * Initial author: Jonas Ahlf
 * Created: Thu Jan 31 17:26:07 CET 2019
 */

const os = require('os');
const fs = require('fs');
const path = require('path');


// BaseDirectory for configuration files
let homeDir = '';
let baseDir = 'LanToolConfigs';

// Static config files
const userCfgName = 'user.cfg';
const friendListName = 'friends.list';

// Config-file paths
let userCfgPath = null;
let friendListPath = null;

/**
 * Generates paths to config files
 * @return {boolean} BaseDir exists
 */
function init() {
    // Set the baseDirectory
    homeDir = os.homedir();
    baseDir = path.join(homeDir, baseDir);

    // Generate config file paths
    userCfgPath = path.join(baseDir, userCfgName);
    friendListPath = path.join(baseDir, friendListName);

    return fs.existsSync(baseDir);
}

function getBaseDir() {
    return baseDir;
}

function getUserCfgPath() {
    return userCfgPath;
}

function getFriendListPath() {
    return friendListPath;
}

module.exports = {
    Init: init,
    GetBaseDir: getBaseDir,
    GetUserCfgPath: getUserCfgPath,
    GetFriendListPath: getFriendListPath
};