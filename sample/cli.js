#!/usr/bin/env node

var AzureContainer = require('zure-content');
var nconf = require('nconf');

// Setup nconf to read from env
nconf.argv().env();

var file          = nconf.get("file")           || nconf.get("AZURE_STORAGE_FILE");
var accountName   = nconf.get("account-name")   || nconf.get("AZURE_STORAGE_ACCOUNT");
var accessKey     = nconf.get("access-key")     || nconf.get("AZURE_STORAGE_ACCESS_KEY");
var accessType    = nconf.get("access-type")    || nconf.get("AZURE_STORAGE_ACCESS_TYPE");
var containerName = nconf.get("container-name") || nconf.get("AZURE_STORAGE_CONTAINER_NAME");

// Prepare an azure container with provided name in order to upload some files
var azureContainer = new AzureContainer(containerName || "documents", accountName, accessKey);


///
/// Run sequence
///
initializeContainer(accessType)
  .then(uploadFile, reportError("initializeContainer"))
  .then(listFiles, reportError("uploadFile"))
  .catch(reportError("listFiles"));


/**
 * Initialze will make sure that a container is created if one does
 * not exist.  But if the container already exists, then this call
 * can be completely removed.
 */
function initializeContainer() {
  return azureContainer.initialize(accessType)
    .done(function(data) {
      console.log("Container initialized", data);
    });
}


/**
 * Upload file/directory
 */
function uploadFile() {
  return azureContainer.fileUpload( AzureContainer.fileMeta.forLocalFiles(file) )
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

