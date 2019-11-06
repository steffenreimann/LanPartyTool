/*
 * Utility functions for game dir 
 * Initial author: Steffen Reimann
 * Created: 20.07.2019
 */
const os = require('os');
const path = require('path');
var fs = require('fs')
const cfgPaths = require('../config/configPaths');


function intiGameDir(dir, pw) {
    const UserConfig = configHelper.LoadUserConfig(pw);
    if(fs.existsSync(UserConfig.tmp)){
        console.log(dir);
    }else{
        fs.mkdirSync(dir);
    }
    console.log(cfgPaths.GetBaseDir());
    
    
}