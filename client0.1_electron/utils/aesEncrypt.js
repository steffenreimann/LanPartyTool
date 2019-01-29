const crypto = require('crypto');

const algorithm = 'aes-256-ctr';

/**
 * Encrypts data with AES algorithm
 * @param key {string}
 * @param data
 */
function encryptBuffer(key, data) {
    const cipher = crypto.createCipher(algorithm, key);
    return Buffer.concat([cipher.update(data), cipher.final()]);
}

function decryptBuffer(key, encryptedData) {
    const decipher = crypto.createDecipher(algorithm,key);
    return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}

/**
 *
 * @param key {string}
 * @param text {string}
 * @returns {*}
 */
function encryptText(key, text) {
    const cipher = crypto.createCipher(algorithm,key);
    let crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decryptText(key, encryptedData) {
    const decipher = crypto.createDecipher(algorithm,key);
    let dec = decipher.update(encryptedData,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

function checkKey(key) {
    return key.length === 32 || key.length === 16 || key.length === 24;
}

module.exports = {
    EncryptBuffer: encryptBuffer,
    DecryptBuffer: decryptBuffer,
    EncryptText: encryptText,
    DecryptText: decryptText
};