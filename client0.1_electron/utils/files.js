/*
 * Utility functions for game dir 
 * Initial author: Steffen Reimann
 * Created: 20.07.2019
 */
const path = require('path');
var fs = require('fs')
const cfgPaths = require('./configPaths');

function intiGameDir(dir) {
    if(dir){

    }

    console.log(cfgPaths.GetBaseDir());
    //fs.mkdirSync(cfgPaths.GetBaseDir());
    
}