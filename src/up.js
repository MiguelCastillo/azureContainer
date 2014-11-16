var azureContainer = require('./factory')();
var fs             = require('fs');
var path           = require('path');
var _              = require('lodash');


/**
 * Initialze will make sure that a container is created if one does
 * not exist.  But if the container already exists, then this call
 * can be completely removed.
 */
function initializeContainer() {
  var files = getFiles();

  return azureContainer.initialize(azureContainer.settings.accessType)
    .done(function(data) {
      console.log("Container initialized", data);
    })
    .then(function() {
      return files;
    });
}


/**
 * Upload file/directory
 */
function uploadFile(files) {
  return azureContainer.fileUpload(files)
    .done(function(data) {
      console.log("Files uploaded", data);
    });
}


/**
 * List container content
 */
function listFiles() {
  return azureContainer.list()
    .done(function(data) {
      console.log("File listing", data);
    });
}


function reportError(from) {
  return function errorHandler(error) {
    console.log(from, error);
  };
}


function getFiles() {
  var files = azureContainer.settings.file;
  var result = [];

  if (typeof(files) === "string") {
    files = files.split(',');
  }

  files.forEach(function(file) {
    result.push.apply(result, getLocalFiles(file.trim()));
  });

  return result;
}


function getLocalFiles(src) {
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
        name: src + "/" + file,
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


module.exports = function() {
  ///
  /// Run sequence
  ///
  initializeContainer()
    .then(uploadFile, reportError("initializeContainer"))
    .then(listFiles, reportError("uploadFile"))
    .catch(reportError("listFiles"));
};
