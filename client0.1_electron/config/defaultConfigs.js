/*
 * Default config objects for template use
 * Initial author: Jonas Ahlf
 * Created: Thu Jan 31 12:44:52 CET 2019
 */

const UserCfg = {name: '', uuid: ''};

const FriendList = {creationDate: new Date(), lastTimeModified: new Date(), friends: []};

const FriendItem = {
    id: '',
    name: '',
    handshakeToken: '',
    handshakeTokenRemote: '',
    "creationTime": new Date(),
    "connectedTime": new Date()
};

module.exports = {
  UserCfg: UserCfg,
  FriendList: FriendList,
  FriendItem: FriendItem
};