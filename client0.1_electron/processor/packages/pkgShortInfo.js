/*
 * Info class for packages which only includes basic
 * information like size, file count, location etc.
 *
 * Author: Jonas Ahlf
 * Created: 06.02.19
*/
'use strict';

const enums = require('./pkgEnums');


class PkgShortInfo {

    /**
     * Creates new instance of PkgShortInfo
     * @param path {string} Absolute path to file/directory
     * @param pkgType {enums.PkgTypeEnum} Type of package
     */
    constructor(path, pkgType) {
        this._path = path;
        this._pkgType = pkgType;
        this.fileCount = 0;
        this.totalSize = 0;
    }

    get path() {
        return this._path;
    }

    get pkgType() { return this._pkgType}

}

