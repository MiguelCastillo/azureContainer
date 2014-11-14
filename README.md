## azureContainer
Utility to simplifly uploading files to an azure container.

AzureContainer is promise based, so each interface that interacts with Azure services will return a promise.

## API

### AzureContainer(container, accountName, accountKey)
Constructor to create instances of the container manager. An intance of AzureContainer provides interfaces to easily interact with your azure containers.

#### arguments
- container - Name of the container to upload files to.
- accountName - Name of the storage account in which the container exists
- accountKey - Access key for the container


### initialize(access) : method
Initializes the container.  If the container name does not exist, one is created.

#### arguments
- accessLevel - Optional string to specify if when creating a container, it should be `private`, public `blob`, or public `container`.  If nothing is proived, then container is `private`.

Examples
- `initialize('container')`
- `initialize('blob')`

#### returns
promise


### uploadFile(src) : promise
Method to upload a file or files in a directory.

#### arguments
- src - Required string that's either the name of a file or a directory.  If a directory name is passed, all files directly below it will be uploaded.  This will probably be upgraded to handle globs.

#### returns
promise


### list() : promise
Method to list the content of a container.

#### arguments
none

#### returns
promise


## Sample code

A fully functional sample running AzureContainer can be seen in <a href='https://github.com/MiguelCastillo/azureContainer/blob/master/test.js'>test.js</a>

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

First create an instance of AzureContainer.  This is the component that gives us access to upload files to a container.

``` javascript
var AzureContainer = require('azureContainer');

// Prepare an azure container with provided name in order to upload some files
var azureContainer = new AzureContainer(container, accountName, accountKey);
```

Then we initialize the container... This will create a container for you if one does not exist.
``` javascript
azureContainer.initialize().then(function() {
```

Then we upload the file
``` javascript
  azureContainer.fileUpload(src).then(function(data) {
    console.log("Files uploaded", data);
```

Now we can list what was uploaded
```
    azureContainer.list().then(function(data) {
      console.log("File listing", data);
```

## Run the sample code
You can run it with something as simple as:

```
$ node test.js --file . --container testme --account-name name --account-key key
```
That command will upload the files in the current directory into the container `testme`, which is located in account `name` and has the access key of `key`.

