var azureContainer = require('./factory')();
var spromise = require('spromise');


/**
 * Download file/directory
 */
function deleteFile() {
  var files = azureContainer.settings.file;

  if (typeof(files) === "string") {
    files = files.split(',');
  }

  files = files.map(function(file) {
    return {name: file.trim()};
  });

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
