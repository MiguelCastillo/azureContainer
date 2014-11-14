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

azureContainer.initialize(type).then(function() {
  azureContainer.fileUpload(src).then(function(data) {
    console.log("Files uploaded", data);
    azureContainer.list().then(function(data) {
      console.log("File listing", data);
    }, reportError);
  }, reportError);
}, reportError);

function reportError(error) {
  console.log(error);
}
