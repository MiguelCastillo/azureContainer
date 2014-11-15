#!/usr/bin/env node

var azureContainer = require('./factory')();


///
/// Run sequence
///
downloadFile()
  .then(listFiles, reportError("downloadFile"))
  .catch(reportError("listFiles"));


/**
 * Download file/directory
 */
function downloadFile() {
  var file = azureContainer.settings.file;

  if (typeof(file) === "string") {
    file = file.split(',').map(function(file) {return {name: file.trim()};});
  }

  return azureContainer.fileDownload(file)
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

