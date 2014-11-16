#!/usr/bin/env node

var confalias = require('../src/confalias');
var nconf = require('nconf');
var fs = require('fs');

// Setup nconf to read from env
nconf
  .argv(confalias)
  .file({ file: '.zure.json' });

function processSettings() {
  // Get args...
  var options  = getOptions();
  var files    = getArgsAsString();
  var print    = nconf.get('print');
  var printAll = nconf.get('all');

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
    nconf.set('file', files);
    nconf.set('f', files);
  }

  if ((!files && !options.length) || print || printAll) {
    printSettings(printAll);
  }
  else {
    nconf.save(function (err) {
      if (err) {
        console.dir(err);
      }
      else {
        printSettings(printAll);
      }
    });
  }
}

function printSettings(printAll) {
  if (printAll) {
    nconf.env();
    console.dir(nconf.get());
  }
  else {
    fs.readFile('.zure.json', function (err, data) {
      console.dir(JSON.parse(data.toString()));
    });
  }
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


processSettings();
