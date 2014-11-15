#!/usr/bin/env node

var nconf = require('nconf');
var fs = require('fs');

// Setup nconf to read from env
nconf
  .argv()
  .file({ file: '.zure.json' });

var file          = nconf.get("file");
var accountName   = nconf.get("account-name");
var accessKey     = nconf.get("account-key");
var accessType    = nconf.get("access-type");
var containerName = nconf.get("container-name");
var print         = nconf.get("print");

nconf.set("file", file);
nconf.set("account-name", accountName);
nconf.set("access-key", accessKey);
nconf.set("access-type", accessType);
nconf.set("container-name", containerName);


if (print) {
  printSettings();
}
else {
  nconf.save(function (err) {
    if (err) {
      console.dir(err);
    }
    else {
      printSettings();
    }
  });
}


function printSettings() {
  fs.readFile('.zure.json', function (err, data) {
    console.dir(JSON.parse(data.toString()));
  });
}
