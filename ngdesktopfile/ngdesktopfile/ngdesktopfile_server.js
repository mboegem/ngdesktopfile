var pathToCallback = {};

$scope.api.writeFile = function(path,bytes)
{
	$scope.api.writeFileImpl(path,servoyApi.getMediaUrl(bytes));
}

$scope.api.readFile = function(path,callback)
{
	pathToCallback[path] = callback;
	$scope.api.readFileImpl(path);
}

$scope.api.callback = function(file) {
	var path = file.getFieldValue("path");
	var callback = pathToCallback[path];
	if (callback) callback(path, file);
	pathToCallback[path] = null;
}