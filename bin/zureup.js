#!/usr/bin/env node

var azureContainer = require('./factory')();


///
/// Run sequence
///
initializeContainer()
  .then(uploadFile, reportError("initializeContainer"))
  .then(listFiles, reportError("uploadFile"))
  .catch(reportError("listFiles"));


/**
 * Initialze will make sure that a container is created if one does
 * not exist.  But if the container already exists, then this call
 * can be completely removed.
 */
function initializeContainer() {
  return azureContainer.initialize(azureContainer.settings.accessType)
    .done(function(data) {
      console.log("Container initialized", data);
    });
}


/**
 * Upload file/directory
 */
function uploadFile() {
  return azureContainer.fileUpload(azureContainer.settings.file)
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

