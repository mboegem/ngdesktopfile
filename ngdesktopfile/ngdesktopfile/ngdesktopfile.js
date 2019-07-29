angular.module('ngdesktopfile',['servoy'])
.factory("ngdesktopfile",function($services, $q, $window) 
{
	var fs = null;
	if (typeof require == "function") {
		fs = require('fs');
	}
	if (fs) {
		return {
			/**
			 * Returns the home dir of the user like c:/users/[username] under windows.
			 * Will return always a both with forward slashes.
			 */
			homeDir: function() {
				return require('os').homedir().replace(/\\/g, "/");
			},
			/**
			 * Returns the tmp directory of the client machine.
			 * Will return always a both with forward slashes.
			 */
			tmpDir: function() {
				return require('os').tmpdir().replace(/\\/g, "/");
			},
			/**
			 * returns an array of filenames that are in the given path. 
			 * Please use forward slashes (/) instead of backward slashes.
			 */
			listDir: function(path) {
				const defer = $q.defer();
				fs.readdir(path, function(error, files) {
					console.log(files);
					 defer.resolve(files);
				})
				return defer.promise;
			},
			/**
			 * Watches a give path, that should represent a file, for modifications.
			 * Please use forward slashes (/) instead of backward slashes in the path/filename
			 */
			watchFile: function(path, callback) {
				fs.watchFile(path, function(curr, prev) {
					  if (curr.mtime != prev.mtime)
					  	$window.executeInlineScript(callback.formname, callback.script, [path]);
				});
			},
			/**
			 * Removes the watch to the file that was added by the watchFile() function.
			 * Please use forward slashes (/) instead of backward slashes in the path/filename
			 */
			unwatchFile: function(path) {
				fs.unwatchFile(path);
			},
			/**
			 * Writes the given bytes to the path, if the path has sub directories that are not there 
			 * then those are made.
			 * Please use forward slashes (/) instead of backward slashes in the path/filename
			 */
			writeFile: function(path, bytes) {
				// empty impl, is implemented in server side api calling the impl method below.
			},
			writeFileImpl: function(path, url) {
				var r = new XMLHttpRequest();
				r.open("GET", url, true);
				r.responseType='arraybuffer';
				r.onload = function(e){
				    var data= Buffer.from(r.response);
				    
				    var dir = path;
				    var index = path.lastIndexOf("/");
				    if (index > 0) {
				    	dir = path.substring(0,index);
				    }
				    fs.mkdir(dir, { recursive: true }, function(err) {
				    	  if (err) throw err;
						    fs.writeFile(path, data, function(err) {
						    	if (err) throw err;
						    });
				    	});
				}
				r.send();
			}
		}
	}
	else {
		return {
			homeDir: function() {console.log("not in electron");},
			listDir: function(path) {console.log("not in electron");},
			watchFile: function(path, callback) {console.log("not in electron");},
			unwatchFile: function(path) {console.log("not in electron");},
			writeFileImpl: function(path, bytes){console.log("not in electron");}
			
		}
	}
})