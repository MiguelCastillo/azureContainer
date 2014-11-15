#!/usr/bin/env node

var AzureContainer = require('../index');
var settings = require('./settings');

// Prepare an azure container with provided name in order to upload some files
var azureContainer = new AzureContainer(settings.container || "Documents", settings.accountName, settings.accountKey);


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
  var files = settings.src;

  if (typeof(files) === "string") {
    files = files.split(',').map(function(file) {return {name: file.trim()};});
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

