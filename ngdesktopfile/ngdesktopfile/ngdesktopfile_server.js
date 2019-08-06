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

$scope.api.callback = function(file, fields) {
	var callback = pathToCallback[fields.path];
	if (callback) callback(fields.path, file, fields);
	pathToCallback[fields.path] = null;
}