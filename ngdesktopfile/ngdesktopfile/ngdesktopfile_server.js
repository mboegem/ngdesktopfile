var pathToCallback = {};

$scope.api.writeFile = function(path,bytes)
{
	$scope.api.writeFileImpl(path,servoyApi.getMediaUrl(bytes));
}

$scope.api.readFile = function(path,callback)
{
	var key;
	var myCallback;
	var myPath;
	
	//path paramter is optional. However, in Javascript the optional parameters should be the last in the list.
	//callback - null or undefined - means that first (and only single) parameter provided is the callback function
	if (!callback) {
		myCallback = path;
		key = Math.random().toString(10);
	} else if (!path) {
		key = Math.random().toString(10);
		myCallback = callback; 
	} else {
		key = path;
		myPath = path;
		myCallback = callback;
	}
	pathToCallback[key] = myCallback;
	$scope.api.readFileImpl(myPath, key);
}

$scope.api.callback = function(file) {
	var path = file.getFieldValue("path");
	var key = file.getFieldValue("id");
	var callback = pathToCallback[key];
	if (callback) callback(path, file);
	pathToCallback[path] = null;
}