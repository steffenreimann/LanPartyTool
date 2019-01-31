const aes = require('./../utils/aesEncrypt');
const uuid = require('uuid/v4');

function generateToken(userUUID) {
    const tokenUUID = uuid();
    return {originToken: tokenUUID, encryptedToken: aes.EncryptBuffer(userUUID, Buffer.from(tokenUUID, 'utf8'))};
}

function decryptToken(userUUID, token, isString) {
    let decrypted = '';
    if (isString === undefined) {
        decrypted = aes.DecryptBuffer(userUUID, token);
    } else {
        decrypted = aes.DecryptBuffer(userUUID, Buffer.from(token));
    }
    return decrypted;
}

module.exports = {
    GenerateToken: generateToken,
    DecryptToken: decryptToken
};