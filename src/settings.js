var confalias = require('./confalias');
var nconf = require('nconf');

// Setup nconf to read from env
nconf
  .argv(confalias)
  .env()
  .file({ file: '.zure.json' });

var defaults ={
  containerName: "documents"
};

var options = getOptions();
var files   = getArgsAsString();

// If no options were passed in, we assume any other options are files
if (!options.length) {
  nconf.set('file', files);
  nconf.set('f', files);
}

var file          = nconf.get("file")           || nconf.get("AZURE_STORAGE_FILE");
var accountName   = nconf.get("account-name")   || nconf.get("AZURE_STORAGE_ACCOUNT");
var accessKey     = nconf.get("access-key")     || nconf.get("AZURE_STORAGE_ACCESS_KEY");
var accessType    = nconf.get("access-type")    || nconf.get("AZURE_STORAGE_ACCESS_TYPE");
var containerName = nconf.get("container-name") || nconf.get("AZURE_STORAGE_CONTAINER_NAME") || defaults.containerName;


function getOptions() {
  var options = nconf.stores.argv.get();
  return Object.keys(options).filter(function(arg) {
    return arg !== '_' && arg !== '$0';
  });
}


function getArgsAsString() {
  return nconf.stores.argv.get('_');
}


module.exports = {
  file: file,
  accountName: accountName,
  accessKey: accessKey,
  accessType: accessType,
  containerName: containerName
};
