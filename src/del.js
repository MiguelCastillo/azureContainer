var azureContainer = require('./factory')();
var spromise       = require('spromise');
var fileMeta       = require('./fileMeta');


/**
 * Download file/directory
 */
function deleteFile() {
  var files = fileMeta.forRemoteFiles(azureContainer.settings.file);

  if (!files.length) {
    return spromise.reject("No files to delete");
  }

  return azureContainer.fileDelete(files)
    .done(function(data) {
      console.log("File deleted", data);
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


module.exports = function() {
  deleteFile()
    .then(listFiles, reportError("deleteFile"))
    .catch(reportError("listFiles"));
};
