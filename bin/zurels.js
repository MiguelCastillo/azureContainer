#!/usr/bin/env node

var azureContainer = require('./factory')();


///
/// Run sequence
///
listFiles()
  .catch(reportError("listFiles"));


/**
 * List container content
 */
function listFiles() {
  return azureContainer.list()
    .done(function(data) {
      console.log("File listing", azureContainer.settings.containerName, data);
    });
}


function reportError(from) {
  return function errorHandler(error) {
    console.log(from, azureContainer.settings.containerName, error);
  };
}

