$scope.api.writeFile = function(path,bytes)
{
	$scope.api.writeFileImpl(path,servoyApi.getMediaUrl(bytes));
}