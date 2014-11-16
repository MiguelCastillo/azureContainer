var fs   = require('fs');
var path = require('path');
var _    = require('lodash');


function _getLocalFile(src) {
  if (!src) {
    throw new TypeError("must provide a valid file/directory");
  }

  var stat = fs.statSync(src);
  var files;

  if (stat.isDirectory()) {
    files = _.filter(fs.readdirSync(src), function(file) {
      var result = path.normalize(src + "/" + file);
      return fs.statSync(result).isFile();
    })
    .map(function(file) {
      return {
        name: src + "/" + file,
        fullPath: path.normalize(src + "/" + file)
      };
    });
  }
  else if (stat.isFile()) {
    files = [{
      name: path.basename(src),
      fullPath: src
    }];
  }

  return files;
}


function forLocalFiles(files) {
  var result = [];

  if (typeof(files) === "string") {
    files = files.split(',');
  }

  files.forEach(function(file) {
    result.push.apply(result, _getLocalFile(file.trim()));
  });

  return result;
}


function forRemoteFiles(files) {
  if (typeof(files) === "string") {
    files = files.split(',');
  }

  return files.map(function(file) {
    return {name: file.trim()};
  });
}


module.exports = {
  forLocalFiles: forLocalFiles,
  forRemoteFiles: forRemoteFiles
};
