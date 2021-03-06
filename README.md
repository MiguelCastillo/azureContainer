## azureContainer
Nodejs component to simplify uploading, downloading, deleting, and listing of files in an Azure container.

It can be used in your code as a library. And installing it globably will make several `zure` CLI commands available to you.

We will start with the API, then a sample `cli.js` to illustrate integrating it in your code, and then we'll go over the `zure` CLI commands.

## Install

```
$ npm install zure-content
```

## API

### AzureContainer(containerName, accountName, accountKey)
Constructor to create instances of the container manager. An intance of AzureContainer provides interfaces to easily interact with your Azure containers.

#### arguments
- `containerName` - Name of the container to upload files to.
- `accountName` - Name of the storage account in which the container exists
- `accountKey` - Access key for the container


### initialize(accessLevel) : method
Initializes the Azure container. If the container name does not exist, one is created.  Otherwise, this is a noop. If you already know the container exists, then you can safely omit this method. If you are unsure, then make sure you call it.

#### arguments
- `accessLevel` - Optional string to specify the access level of the creating a container.  Valid values are `private`, public `blob`, or public `container`.  Default is `private`.

Examples
- `initialize('container')`
- `initialize('blob')`

#### returns
promise


### uploadFile(files) : promise
Method to upload files to an Azure container

#### arguments
- `files` - Required array of file(s) to be uploaded. In order to build a proper list of files, use `getLocalFiles`. See <a href='https://github.com/MiguelCastillo/azureContainer#filemetaforlocalfilesfiles--directories--arrayfiles--static'>`getLocalFiles`</a> for more details.

#### returns
promise


### downloadFile(files) : promise
Method to donwload files from an Azure container.

#### arguments
- `files` - Required array of file(s) to be downloaded. In order to build a proper list of files, use `getRemoteFiles`. See <a href='https://github.com/MiguelCastillo/azureContainer#filemetaforremotefilesfiles--arrayfiles--static'>`getRemoteFiles`</a> for more details.

#### returns
promise


### deleteFile(files) : promise
Method to delete files from an Azure container.

#### arguments
- `files` - Required array for the file(s) to be deleted. In order to build a proper list of files, use `getRemoteFiles`. See <a href='https://github.com/MiguelCastillo/azureContainer#filemetaforremotefilesfiles--arrayfiles--static'>`getRemoteFiles`</a> for more details.

#### returns
promise


### list() : promise
Method to list the files in an Azure container.

#### arguments
none

#### returns
promise


### fileMeta.forLocalFiles(files | directories) : Array&lt;files&gt; : static
Method to create an array of files suitable for operations such as file upload.  It can take in a combination of file and directory names.  For directories all files are loaded, but not recursively.  This method will also verifies that all files exist.

``` javascript
var AzureContainer = require('zure-content');
var azureContainer = new AzureContainer(containerName, accountName, accessKey);

// Create proper list of files for upload.
var files = AzureContainer.fileMeta.forLocalFiles(['file1.txt', 'file2.txt', 'src']);

// Upload files
azureContainer.uploadFile(files);
```

#### arguments
- `files` - A string or array of file names to be processed.  If it is a string, it can be a list of comma separated names.  E.g.  `file1.txt, file2.txt`.
- `directories` - A string or array of directory names to be processed.  If it is a string, it can be a list of comma separated names. E.g. `bin, src`.

#### returns
Array< {file: filename, fullPath: pathtofile} >


### fileMeta.forRemoteFiles(files) : Array&lt;files&gt; : static
Method to create an array of files suitable for operations such as download/delete.

``` javascript
var AzureContainer = require('zure-content');
var azureContainer = new AzureContainer(containerName, accountName, accessKey);

// Create proper list of files for deletion.
var files = AzureContainer.fileMeta.forRemoteFiles(['file1.txt', 'file2.txt']);

// Delete files
azureContainer.deleteFile(files);
```

#### arguments
- `files` - A string or array of file names to be processed.  If it is a string, it can be a list of comma separated names.  E.g.  `file1.txt, file2.txt`.

#### returns
Array< {file: filename} >


## Sample code

A fully functional sample running AzureContainer can be seen in <a href='https://github.com/MiguelCastillo/azureContainer/blob/master/sample/cli.js'>cli.js</a>

#### Running the sample

In order to run the sample, you will need a storage account name and an access key to the storage account.

```
$ cd sample
$ npm install
$ ./cli.js --account-name accountname --access-key accesskey --file cli.js
```

Let's dissect the code right here:

#### nconf
`nconf` allows us to process input from the cli and environment variables.  Whichever is found first, with cli arguments having higher priority.

``` javascript
var nconf = require('nconf');

// Setup nconf to read from env
nconf.argv().env();

var file          = nconf.get("file")           || nconf.get("AZURE_STORAGE_FILE");
var accountName   = nconf.get("account-name")   || nconf.get("AZURE_STORAGE_ACCOUNT");
var accessKey     = nconf.get("access-key")     || nconf.get("AZURE_STORAGE_ACCESS_KEY");
var accessType    = nconf.get("access-type")    || nconf.get("AZURE_STORAGE_ACCESS_TYPE");
var containerName = nconf.get("container-name") || nconf.get("AZURE_STORAGE_CONTAINER_NAME");
```

See <a href="#arguments-and-environment-variables">Arguments and environment variables</a> for details on those fields.


#### AzureContainer

Create an instance of AzureContainer.  This is the component that gives us access to upload files to an Azure container.

``` javascript
var AzureContainer = require('azure-content');

// Prepare an azure container with provided name in order to upload files
var azureContainer = new AzureContainer(containerName, accountName, accessKey);
```

Then we initialize the container... This will create a container for you if one does not exist.  This call is completely optional if you know the container you are going to upload your files to already exists.  We include it here to be thorough.
``` javascript
azureContainer.initialize()
```

Then we upload the file
``` javascript
azureContainer.fileUpload( AzureContainer.fileMeta.forLocalFiles(file) )
```

Now we can list what was uploaded
``` javascript
azureContainer.list()
```

## CLI

When azureContainer is installed globally, several shell commands become availalbe that we will be going over shortly; `zure-init`, `zureup`, `zuredown`, `zuredel`, and `zurels`.

In order to run `zureup`, `zuredown`, `zuredel`, and `zurels` you must provide an account name and an access key.  You can set those as arguments, directory settings (more on this in a second), and/or as environment variables; any combination is valid.

- The order of precendence is arguments, directory settings, and envrionment variables.


### Arguments and environment variables

Arguments        | Alias  | Environment Variable         | Descriptions
-----------------|--------|------------------------------|----------------
--file           | -f     | AZURE_STORAGE_FILE           | file(s) to be uploaded/download/deleted
--account-name   | -a     | AZURE_STORAGE_ACCOUNT        | Azure storage account name
--access-key     | -k     | AZURE_STORAGE_ACCESS_KEY     | Azure storage account access key
--container-name | -c     | AZURE_STORAGE_CONTAINER_NAME | Azure container to upload/delete/download and list files to and from.
--access-type    |  n/a   | AZURE_STORAGE_ACCESS_TYPE    | Access type when creating a container


### zure-init

azureContainer supports per directory settings, and this is the command to do it. This is really handy if you want to simplify all `zure` commands you execute routinely in a particular directory.

For example, the command below will create a settings file that will automatically set `index.js` as the file and `dist` as the container.  Once configured, all further `zure` commands will use that file and container.

```
$ zure-init -f index.js -c dist
```

Now anytime you run the command below, the file `index.js` will be uploaded to the container `dist`.

```
$ zureup
```

And running the command below will just list all the files in the container `dist`.

```
$ zurels
```

And the command below will delete `index.js` from the container `dist`

```
$ zuredel
```

- You can setup an access key and account name for each directory as well.


### zureup

Command uploads `-f` file(s) to an Azure container.  You can specify a file, a list of files, and directories.

```
$ zureup -f . -c testme -a name -k key
```

That will upload all the files in the current directory to the container `testme`, which is located in the Azure storage account `name` with access key of `key`.

```
$ zureup -f "file1.txt, file2.txt" -c testme -a name -k key
```

That will upload `file1.txt` and `file2.txt` form the current directory.

That's a lot of information in each command, but you can configure azureContainer to really simplify all `zure` commands.  Please see <a href="#configuring-azurecontainer-cli">Configuring azureContainer</a> for more details.


### zuredel

Command to delete `-f` file(s) from an Azure container.

```
$ zuredel -f "file1.txt, file2.txt" -c testme
```

### zuredown

Command to download `-f` file(s) from an Azure container.

```
$ zuredown -f "file1.txt, file2.txt" -c testme
```

### zurels

Command to list all files in an Azure container.

```
$ zurels -c testme
```


### Configuring azureContainer CLI

- First, install azureContainer globably. Then you customize it with global or per directory settings.

  `$ npm install zure-content -g`


##### How to simplify `zure` commands with global settings:

- Add `AZURE_STORAGE_ACCOUNT` as an environment variable.

  `$ export AZURE_STORAGE_ACCOUNT='azureme'`

- Add `AZURE_STORAGE_ACCESS_KEY` as an environment variable.

  `$ export AZURE_STORAGE_ACCESS_KEY='==yourcontainerkey=='`

Now from the command line you can run something like:

```
$ zureup -f document.txt
```

That uploads `document.txt` to the default container `documents`.  You can configure the container as an environment variable as well so that further uploads go to a different location.

```
$ export AZURE_STORAGE_CONTAINER_NAME='AnotherFolder'
```


#### Alternativaly, you can configure azureContainer per directory

- Add `account-name`, `access-key`, and `container-name` in one command.

```
$ zure-init -a sweetaccount -k my-access-key -c remotecontainer
```

Now you can upload `document.txt` with the following command

```
$ zureup -f document.txt
```

You can also preconfigure the files to be uploaded. For example, you can set two files to always be uploaded with the following command:

```
$ zure-init -f "document.txt someother.doc"
```

You can further simplify that.  When you have azureContainer configured with a container name, access key, and account name you can just call the `zure` commands with just a list of files.  E.g.

```
$ zureup document.txt someother.doc
$ zuredel document.txt someother.doc
```


## How I use it

I generally will have some default global settings so that I can just call `zure` commands from any directory.  I will do per directory settings for directories I frequently use with its own Azure container. The goal for me is to simplify the arguments I pass into all `zure` commands.
