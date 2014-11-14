"use strict";


var azure    = require('azure-storage');
var spromise = require('spromise');
var fs       = require('fs');
var path     = require('path');
var _        = require('lodash');


function Container(containerName, accountName, accountKey) {
  this.name    = containerName;
  this.blobSvc = azure.createBlobService(accountName, accountKey);
}


Container.prototype.initialize = function initialize(access) {
  access  = access || {publicAccessLevel : 'container'};
  var _self = this;

  return spromise(function() {
    _self.blobSvc.createContainerIfNotExists(_self.name, access, resolveThis.bind(this));
  });
};


Container.prototype.fileUpload = function fileUpload(src, dest) {
  var _self = this;
  var files;
  dest = path.normalize(dest || '');
  
  try {
    files = getFiles(src);  
  }
  catch(ex) {
    return spromise.reject(ex.message);
  }
  
  var multiple = files.length > 1;

  return spromise.all(files.map(function(file) {
    return spromise(function() {
      var remoteFile = multiple ? path.join(dest, file.name) : dest;      
      _self.blobSvc.createBlockBlobFromLocalFile(_self.name, remoteFile, file.fullPath, resolveThis.bind(this));
    });
  }));
};


Container.prototype.list = function list() {
  var _self = this;
  return spromise(function() {
    _self.blobSvc.listBlobsSegmented(_self.name, null, resolveThis.bind(this));
  });
};


function resolveThis(error, result /*, response*/) {
  if (error) {
    this.reject(error);
  }
  else {
    this.resolve(result);
  }
}  


function getFiles(src) {
  if (!src) {
    throw new TypeError("must provide a valid file/directory");
  }

  var stat = fs.statSync(src);
  var files;

  if (stat.isDirectory()) {
    files = _.filter(fs.readdirSync(src), function(file) {
      var result = path.normalize(src + "/" + file);
      return fs.statSync(result).isFile();
    })
    .map(function(file) {
      return {
        name: file,
        fullPath: path.normalize(src + "/" + file)
      };
    });
  }
  else if (stat.isFile()) {
    files = [{
      name: path.basename(src),
      fullPath: src
    }];
  }

  return files;
}


module.exports = Container;
