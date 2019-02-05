/*
 * Initial author: Jonas Ahlf
 * Created: Thu Jan 31 16:59:04 CET 2019
 */
const cfgPaths = require('./configPaths');
const cfgDefs = require('./defaultConfigs');
const util = require('./../utils/swissKnife');
const fs = require('fs');
const aes = require('../utils/aesEncrypt');
const uuid = require('uuid/v4');



let friendList = null;

/**
 * Loads friendlist and decrypts it with given userUUID
 * friendlist is stored as global within friendListHelper
 * @param userUUID {string}
 * @returns {{fileExists: boolean, parseError: boolean}} ;
 */
function init(userUUID) {
    const result = {fileExists: false, parseError: false};
    if (!fs.existsSync(cfgPaths.GetFriendListPath())) {
        return result;
    }
    // TODO could be quit problematic if file gets too big, change to async in future
    const raw = fs.readFileSync(cfgPaths.GetFriendListPath());
    result.fileExists = true;

    let decrypted = aes.DecryptBuffer(userUUID, raw);
    decrypted = decrypted.toString('utf8');
    let jsonObj = null;
    try {
        jsonObj = JSON.parse(decrypted);
    } catch (e) {
        console.error('Could not parse friendlist from file');
        result.parseError = true;
        return result;
    }
    friendList = jsonObj;
    return result;
}

/**
 * Creates a default friendlist with no items and writes them to file
 * @param userUUID {string}
 * @returns {boolean}
 */
function createDefault(userUUID) {
    friendList = util.Clone(cfgDefs.FriendList);
    friendList.creationDate = new Date();
    friendList.lastTimeModified = new Date();
    return writeFriendList(userUUID);
}

/**
 * Creates new friendItem
 * @param name {string}
 * @param handshakeToken {string} not allowed to be null
 * @param remoteHandshakeToken {?string} can be undefined, if so than it gets converted to null
 * @returns {cfgDefs.FriendItem}
 */
function createFriend(name, handshakeToken, remoteHandshakeToken) {
    const newFriend = util.Clone(cfgDefs.FriendItem);
    newFriend.name = name;
    newFriend.id = uuid();
    newFriend.handshakeToken = handshakeToken;
    if (remoteHandshakeToken === undefined) {
        newFriend.handshakeTokenRemote = null;
    } else {
        newFriend.handshakeTokenRemote = remoteHandshakeToken;
    }
    return newFriend;
}

/**
 * Writes class member friendlist to a file encrypted with UserUUID
 * @param userUUID {string}
 * @returns {boolean}
 */
function writeFriendList(userUUID) {
    if (friendList === null) {
        return false;
    }
    const jsonText = JSON.stringify(friendList);
    const jsonBytes = new Buffer(jsonText, 'utf8');
    const encrypted = aes.EncryptBuffer(userUUID, jsonBytes);
    try {
        fs.writeFileSync(cfgPaths.GetFriendListPath(), encrypted);
        return true;
    } catch (e) {
        console.error('Could not write friendlist');
        return false;
    }
}

/**
 * Null when not initialized
 * @returns {Object}
 */
function getFriendlist() {
    return friendList;
}

/**
 *
 * @param id {string}
 * @returns {?{friend: Object, index: number}} 'null when not found or friendlist not initialized
 */
function getFriendItemById(id) {
    if (friendList === null) {
        return null;
    }
    for (let i = 0; i < friendList.friends.length; i++) {
        const current = friendList.friends[i];
        if (current.id === id) {
            return {friend: current, index: i};
        }
    }
    return null;
}

/**
 * Removes friend from list
 * @param id {string}
 * @returns {boolean}
 */
function removeFriendById(id) {
    const friend = getFriendItemById(id);
    if (friend === null) {
        return false;
    }
    friendList.friends.splice(friend.index, 1);
    return true;
}

/**
 * Adds a friendItem to list
 * Attention does not write list back to file!
 * @param item {Object} FriendItem
 * @returns {{notDefined: boolean, duplicate: boolean}}
 */
function addFriendItem(item) {
    const result = {notDefined: false, duplicate: false};
    if (friendList === null) {
        result.notDefined = true;
        return result;
    }
    // Check if this item is a duplicate
    if (_checkForDuplicate(item)) {
        result.duplicate = true;
        return result;
    }
    friendList.friends.push(item);
}

/**
 * Checks if friendItem already exists within friendlist
 * Attention no further checking if friendlist is null!!
 * @param item {Object}
 * @returns {boolean} true == duplicate
 * @private
 */
function _checkForDuplicate(item) {
    for (let i = 0; i < friendList.friends.length; i++) {
        const current = friendList.friends[i];
        // Excluding name, this property can exists multiple times
        // same goes for creationTime and connectedTime
        if (current.handshakeToken === item.handshakeToken
            || current.handshakeTokenRemote === item.handshakeTokenRemote) {
            return true;
        }
    }
    return false;
}

module.exports = {
    Init: init,
    CreateDefault: createDefault,
    CreateFriend: createFriend,
    GetFriendList: getFriendlist,
    GetFriendItemById: getFriendItemById,
    RemoveFriendById: removeFriendById,
    AddFriendItem: addFriendItem
}