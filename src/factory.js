var AzureContainer = require('./container');
var settings = require('./settings');

function factory() {
  var provider = new AzureContainer(settings.containerName, settings.accountName, settings.accessKey);
  provider.settings = settings;
  return provider;
}

module.exports = factory;
