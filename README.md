## azureContainer
Simplify upload, download, delete, and listing of files in an azure container.


## Install

```
$ npm install zure-content
```

## API

### AzureContainer(container, accountName, accountKey)
Constructor to create instances of the container manager. An intance of AzureContainer provides interfaces to easily interact with your azure containers.

#### arguments
- `container` - Name of the container to upload files to.
- `accountName` - Name of the storage account in which the container exists
- `accountKey` - Access key for the container


### initialize(access) : method
Initializes the container.  If the container name does not exist, one is created.  If you already know the container exists, then you can safely omit calling this method.  If you are doubt, then always call this method.

#### arguments
- `accessLevel` - Optional string to specify if when creating a container, it should be `private`, public `blob`, or public `container`.  If nothing is proived, then container is `private`.

Examples
- `initialize('container')`
- `initialize('blob')`

#### returns
promise


### uploadFile(file | directory) : promise
Method to upload a file or files in a directory.

#### arguments
- `file | directory` - Required string that's either the name of a file or a directory.  If a directory name is passed, all files directly below it will be uploaded.  This will probably be upgraded to handle globs.

#### returns
promise


### downloadFile(file | files) : promise
Method to donwload a file or group of files.

#### arguments
- `file | files` - Require string|array for the file(s) name to be downloaded.

#### returns
promise


### deleteFile(file | files) : promise
Method to delete a file or group of files.

#### arguments
- `file | files` - Require string|array for the file(s) name to be deleted.

#### returns
promise


### list() : promise
Method to list the content of a container.

#### arguments
none

#### returns
promise


## Sample code

A fully functional sample running AzureContainer can be seen in <a href='https://github.com/MiguelCastillo/azureContainer/blob/master/cli.js'>cli.js</a>

Let's dissect it right here:

#### nconf
`nconf` allows us to process input from the cli and environment variables.  Whichever is found first, with cli arguments having higher priority.

``` javascript
var nconf = require('nconf');

// Setup nconf to read from env
nconf.argv().env();

var accountName = nconf.get("account-name") || nconf.get("AZURE_STORAGE_ACCOUNT");
var accountKey  = nconf.get("account-key")  || nconf.get("AZURE_STORAGE_ACCESS_KEY");
var container   = nconf.get("container")    || nconf.get("AZURE_STORAGE_CONTAINER");
var src         = nconf.get("file")         || nconf.get("AZURE_STORAGE_FILE");
var type        = nconf.get("type")         || nconf.get("AZURE_STORAGE_TYPE");
```

- accountName is the name of azure account where the container is located.
- accountKey is the container access key.
- container is the name of the container where files are uploaded to
- src is what we are uploading.  This can be a file or a directory.  NOTE: directories are not processed recursively.
- type is the type of container to create if one does not already exist.  Defaults to `private`.


#### AzureContainer

First create an instance of AzureContainer.  This is the component that gives us access to upload files to an Azure container.

``` javascript
var AzureContainer = require('azureContainer');

// Prepare an azure container with provided name in order to upload some files
var azureContainer = new AzureContainer(container, accountName, accountKey);
```

Then we initialize the container... This will create a container for you if one does not exist.  This call is completely optional if you know the container you are going to upload your file/directory to already exists.  We include it here to be thorough.
``` javascript
azureContainer.initialize()
```

Then we upload the file
``` javascript
azureContainer.fileUpload(file)
```

Now we can list what was uploaded
``` javascript
azureContainer.list()
```

## CLI

When azureContainer is installed globally, several shell commands will become availalbe; `zureup`, `zuredown`, `zuredel`, and `zuredls`.

### zureup

Command uploads a file or the files in a directory to an Azure container.

```
$ zureup --file . --container testme --account-name name --account-key key
```

That command will upload all the files in the current directory to the container `testme`, which is located in account `name` and has the access key of `key`.

That's a lot of information, but if you configure `zure-content` correctly you can really simplify all `zure` commands.


##### How to simplify `zure` commands:

- Install azureContainer globally.

  `$ npm install zure-content -g`

- Add `AZURE_STORAGE_ACCOUNT` as an environment variable.

  `$ export AZURE_STORAGE_ACCOUNT='azureme'`

- Add `AZURE_STORAGE_ACCESS_KEY` as an environment variable.

  `$ export AZURE_STORAGE_ACCESS_KEY='==yourcontainerkey=='`

Now from the command line you can run something like:

```
$ zureup --file document.txt
```

That uploads `document.txt` to the default container `Documents`.  You can configure the container as an environment variable as well so that further uploads go to a different location.

```
$ export AZURE_STORAGE_CONTAINER='AnotherFolder'
```


### zurels

Command to list all files in the Azure container.

```
$ zurels
```


### zuredel

Command to delete `--file` from the Azure container.  `--file` can take a list of comma separated files.  e.g.

```
$ zuredel --file "file1.txt, file2.txt"
```


### zuredown

Command to download `--file` from Azure container.  `--file` can take a list of comma separated files.

```
$ zuredown --file "file1.txt, file2.txt"
```

