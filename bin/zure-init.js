#!/usr/bin/env node

var nconf = require('nconf');
var fs = require('fs');

// Setup nconf to read from env
nconf
  .argv()
  .file({ file: '.zure.json' });

// Get args...
var args  = getArgs();
var print = nconf.get('print');

args.forEach(function(key) {
  var value = nconf.get(key);

  if (value !== true) {
    nconf.set(key, value);
  }
  else {
    nconf.clear(key);
  }
});


if (!args.length || print) {
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


function getArgs() {
  var args = nconf.stores.argv.get();
  return Object.keys(args).filter(function(arg) {
    return arg !== '_' && arg !== '$0';
  });
}
