var pathToCallback = {};

$scope.api.writeFile = function(path,bytes)
{
	$scope.api.writeFileImpl(path,servoyApi.getMediaUrl(bytes));
}

$scope.api.readFile = function(callback, path)
{
	var key;
	
	if (!path) {
		key = Math.random().toString(10);
	} else {
		key = path;
	}
	pathToCallback[key] = callback;
	$scope.api.readFileImpl(path, key);
}

$scope.api.callback = function(file) {
	var path = file.getFieldValue("path");
	var key = file.getFieldValue("id");
	var callback = pathToCallback[key];
	if (callback) callback(path, file);
	pathToCallback[path] = null;
}