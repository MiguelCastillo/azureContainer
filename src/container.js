var azure    = require('azure-storage');
var spromise = require('spromise');
var fs       = require('fs');


function Container(containerName, accountName, accountKey) {
  this.name    = containerName;
  this.blobSvc = azure.createBlobService(accountName, accountKey);
}


Container.prototype.initialize = function initialize(accessLevel) {
  var _self = this;
  var access = accessLevel ? {publicAccessLevel: accessLevel} : null;

  return spromise(function() {
    _self.blobSvc.createContainerIfNotExists(_self.name, access, resolveThis.bind(this));
  });
};


Container.prototype.fileUpload = function fileUpload(files) {
  var _self = this;

  if (!files) {
    throw new TypeError("Must provide files to upload");
  }

  return spromise.all(files.map(function(file) {
    return spromise(function() {
      _self.blobSvc.createBlockBlobFromLocalFile(_self.name, file.name, file.fullPath, resolveThis.bind(this));
    });
  }));
};


Container.prototype.fileDownload = function fileDownload(files) {
  var _self = this;

  if (!files) {
    return spromise.reject("Must provide files to download");
  }

  return spromise.all(files.map(function(file) {
    return spromise(function() {
      _self.blobSvc.getBlobToStream(_self.name, file.name, fs.createWriteStream(file.name), resolveThis.bind(this));
    });
  }));
};


Container.prototype.fileDelete = function fileDownload(files) {
  var _self = this;

  if (!files) {
    return spromise.reject("Must provide files to delete");
  }

  return spromise.all(files.map(function(file) {
    return spromise(function() {
      _self.blobSvc.deleteBlob(_self.name, file.name, resolveThis.bind(this));
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


module.exports = Container;
