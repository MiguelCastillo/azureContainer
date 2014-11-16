var azureContainer = require('./factory')();


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


module.exports = function() {
  listFiles()
    .catch(reportError("listFiles"));
};
