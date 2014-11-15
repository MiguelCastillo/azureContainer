#!/usr/bin/env node

var AzureContainer = require('./index');
var nconf = require('nconf');

// Setup nconf to read from env
nconf.argv().env();

var accountName = nconf.get("account-name") || nconf.get("AZURE_STORAGE_ACCOUNT");
var accountKey  = nconf.get("account-key")  || nconf.get("AZURE_STORAGE_ACCESS_KEY");
var container   = nconf.get("container")    || nconf.get("AZURE_STORAGE_CONTAINER");
var src         = nconf.get("file")         || nconf.get("AZURE_STORAGE_FILE");
var type        = nconf.get("type")         || nconf.get("AZURE_STORAGE_TYPE");

// Prepare an azure container with provided name in order to upload some files
var azureContainer = new AzureContainer(container, accountName, accountKey);


///
/// Run sequence
///
initializeContainer(type)
  .then(uploadFile, reportError("initializeContainer"))
  .then(listFiles, reportError("uploadFile"))
  .catch(reportError("listFiles"));


/**
 * Initialze will make sure that a container is created if one does
 * not exist.  But if the container already exists, then this call
 * can be completely removed.
 */
function initializeContainer() {
  return azureContainer.initialize(type)
    .done(function(data) {
      console.log("Container initialized", data);
    });
}


/**
 * Upload file/directory
 */
function uploadFile() {
  return azureContainer.fileUpload(src)
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

