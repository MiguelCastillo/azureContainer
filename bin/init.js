#!/usr/bin/env node

var confalias = require('../src/confalias');
var nconf = require('nconf');
var fs = require('fs');

// Setup nconf to read from env
nconf
  .argv(confalias)
  .file({ file: '.zure.json' });

// Get args...
var options = getOptions();
var args    = getArgsAsString();
var print   = nconf.get('print');

options.forEach(function(key) {
  var value = nconf.get(key);

  if (value !== true) {
    nconf.set(key, value);
  }
  else {
    nconf.clear(key);
  }
});


if (!options.length) {
  nconf.set('file', '"' + getArgsAsString() + '"');
  nconf.set('f', '"' + getArgsAsString() + '"');
}


if ((!args && !options.length) || print) {
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


function getOptions() {
  var options = nconf.stores.argv.get();
  return Object.keys(options).filter(function(arg) {
    return arg !== '_' && arg !== '$0';
  });
}


function getArgsAsString() {
  return nconf.stores.argv.get('_').join(",");
}
