#!/usr/bin/env node

var azureContainer = require('./factory')();


///
/// Run sequence
///
deleteFile()
  .then(listFiles, reportError("deleteFile"))
  .catch(reportError("listFiles"));


/**
 * Download file/directory
 */
function deleteFile() {
  var file = azureContainer.settings.file;

  if (typeof(file) === "string") {
    file = file.split(',').map(function(file) {return {name: file.trim()};});
  }

  return azureContainer.fileDelete(file)
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

