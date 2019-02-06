/*
 * Analyzer which checks Files/Directories and creates info objects about them
 *
 * Author: Jonas Ahlf
 * Created: 06.02.19
*/
const fs = require('fs');
const util = require('./../../utils/swissKnife');
const pkgEnums = require('./pkgEnums');
const pkgShortInfo = require('./pkgShortInfo');
const pathUtil = require('path');

const archiveExtensions = ['.zip', '.rar', '.tar', '.tar.bz', 'tar.gz'];

/**
 * Callback for shortInfo
 * @callback shortInfoCallback
 * @param {?pkgShortInfo}
 */

/**
 *
 * @param path
 * @param callback {shortInfoCallback}
 */
function shortAnalyze(path, callback) {

    // Determine if File or directory and when file if archive
    const pathStat = fs.lstatSync(path);
    let info = new pkgShortInfo(path, pkgEnums.PkgTypeEnum.singleFile);
    if (pathStat.isFile()) {
        if (_isArchive(path)) {
            info = new pkgShortInfo(path, pkgEnums.PkgTypeEnum.archive);
        } else {
            info = new pkgShortInfo(path, pkgEnums.PkgTypeEnum.singleFile);
        }
    } else {
        if (!pathStat.isDirectory()) {
            console.error(util.frm('Path: {0} is not a file nor a directory',[path]));
            callback(null);
            return;
        }
    }

    if (info.pkgType === pkgEnums.PkgTypeEnum.singleFile) {
        info.fileCount = 1;
        info.totalSize = _getFileSizeInBytes(info.path);
        callback(info);
        return;
    }

}


/**
 * Checks if file is an archive file
 * @param path {string}
 * @returns {boolean} true == isArchive
 * @private
 */
function _isArchive(path) {
    const extension = pathUtil.extname(path);
    return archiveExtensions.indexOf(extension) !== -1;
}

/**
 *
 * @param filename {string}
 * @returns {number}
 * @private
 */
function _getFileSizeInBytes(filename) {
    const stats = fs.statSync(filename);
    return stats.size
}

function analyzeDirSize(path, callback) {
    let totalSize = 0;
    const files = [];
}

function getFilesFromDir(path) {

}