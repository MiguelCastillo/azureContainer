var azureContainer = require('./factory')();
var spromise       = require('spromise');
var fileMeta       = require('./fileMeta');


/**
 * Download file/directory
 */
function downloadFile() {
  var files = fileMeta.forRemoteFiles(azureContainer.settings.file);

  if (!files.length) {
    return spromise.reject("No files to download");
  }

  return azureContainer.fileDownload(files)
    .done(function(data) {
      console.log("File uploaded", data);
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
  downloadFile()
    .then(listFiles, reportError("downloadFile"))
    .catch(reportError("listFiles"));
};
