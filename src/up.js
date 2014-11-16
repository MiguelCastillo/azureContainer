var azureContainer = require('./factory')();
var fileMeta       = require('./fileMeta');


/**
 * Initialze will make sure that a container is created if one does
 * not exist.  But if the container already exists, then this call
 * can be completely removed.
 */
function initializeContainer() {
  var files = fileMeta.forLocalFiles(azureContainer.settings.file);

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


module.exports = function() {
  ///
  /// Run sequence
  ///
  initializeContainer()
    .then(uploadFile, reportError("initializeContainer"))
    .then(listFiles, reportError("uploadFile"))
    .catch(reportError("listFiles"));
};
