var nconf = require('nconf');

// Setup nconf to read from env
nconf.argv().env();

var accountName = nconf.get("account-name") || nconf.get("AZURE_STORAGE_ACCOUNT");
var accountKey  = nconf.get("account-key")  || nconf.get("AZURE_STORAGE_ACCESS_KEY");
var container   = nconf.get("container")    || nconf.get("AZURE_STORAGE_CONTAINER");
var src         = nconf.get("file")         || nconf.get("AZURE_STORAGE_FILE");
var type        = nconf.get("type")         || nconf.get("AZURE_STORAGE_TYPE");

module.exports = {
  accountName: accountName,
  accountKey: accountKey,
  container: container,
  src: src,
  type: type
};
