/*
 * Default config objects for template use
 * Initial author: Jonas Ahlf
 * Created: Thu Jan 31 12:44:52 CET 2019
 */

const UserCfg = {name: '', uuid: ''};

const FriendList = {creationDate: new Date(), lastTimeModified: new Date(), friends: []};

const FriendItem = {
    name: '',
    handshakeToken: '',
    handshakeTokenRemote: '',
    "creationTime": null,
    "connectedTime": null
};