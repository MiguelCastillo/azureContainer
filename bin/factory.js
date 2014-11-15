var AzureContainer = require('../index');
var nconf = require('nconf');

// Setup nconf to read from env
nconf
  .argv()
  .env()
  .file({ file: '.zure.json' });

var defaults ={
  containerName: "documents"
};


var file          = nconf.get("file")           || nconf.get("AZURE_STORAGE_FILE");
var accountName   = nconf.get("account-name")   || nconf.get("AZURE_STORAGE_ACCOUNT");
var accessKey     = nconf.get("access-key")     || nconf.get("AZURE_STORAGE_ACCESS_KEY");
var accessType    = nconf.get("access-type")    || nconf.get("AZURE_STORAGE_ACCESS_TYPE");
var containerName = nconf.get("container-name") || nconf.get("AZURE_STORAGE_CONTAINER_NAME") || defaults.containerName;


function factory() {
  var provider = new AzureContainer(containerName, accountName, accessKey);

  provider.settings = {
    file: file,
    accountName: accountName,
    accountKey: accessKey,
    accessType: accessType,
    containerName: containerName
  };

  return provider;
}

module.exports = factory;
