angular.module('ngdesktopfile',['servoy'])
.factory("ngdesktopfile",function($services, $q, $window,$utils) 
{
	var fs = null;
	var request = null;
	var session = null;
	if (typeof require == "function") {
		fs = require('fs');
		request = require('request');
		session= require('electron').remote.session;
		
		var j = request.jar();
		request = request.defaults({jar:j});
		// Query all cookies.
		session.defaultSession.cookies.get({})
		  .then(function(cookies) {
		    cookies.forEach(function(cookie) {
		    	var ck = request.cookie(cookie.name + '=' + cookie.value);
		    	j.setCookie(ck, document.baseURI);
		    });
		  }).catch(function(error){
		    console.log(error)
		  })
	}
	if (fs) {
		function getFullUrl(url) {
			var base = document.baseURI;
			if (!base.endsWith("/")) base = base + "/";
			return base + url;
		}
		var defer = null;
		function waitForDefered(func) {
			if (defer != null) {
				defer.promise.then(function(){
					func();
				})
			}
			else func();
		}
		return {
			waitForDefered: function(func) {
				waitForDefered(func);
			},
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
				waitForDefered(function() {
					fs.readdir(path, function(error, files) {
						 defer.resolve(files);
					})
				})
				return defer.promise;
			},
			/**
			 * Watches a give path, that should represent a file, for modifications.
			 * Please use forward slashes (/) instead of backward slashes in the path/filename
			 */
			watchFile: function(path, callback) {
				waitForDefered(function() {
					fs.watchFile(path, function(curr, prev) {
						  if (curr.mtime != prev.mtime)
						  	$window.executeInlineScript(callback.formname, callback.script, [path]);
					});
				})
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
				waitForDefered(function() {
					defer = $q.defer();
				    var dir = path;
				    var index = path.lastIndexOf("/");
				    if (index > 0) {
				    	dir = path.substring(0,index);
				    }
				    fs.mkdir(dir, { recursive: true }, function(err) {
				    	if (err) throw err;
						const pipe = request(getFullUrl(url)).pipe(fs.createWriteStream(path));
						pipe.on("close", function() {
							defer.resolve(true);
							defer = null;
						});
					});
				})
			},
			/**
			 * Reads the given bytes of a path, the callback is a function that will get as paremeters the 'path' and the 'file'.
			 * Please use forward slashes (/) instead of backward slashes in the path/filename
			 */
			readFile: function(path, callback) {
				// empty impl, is implemented in server side api calling the impl method below.
			},
			readFileImpl: function(path) {
				waitForDefered(function() {
					var formData = {
						path: path,
						file: fs.createReadStream(path)
					};
					request.post({url:getFullUrl($utils.generateServiceUploadUrl("ngdesktopfile", "callback")), formData: formData},
						function optionalCallback(err, httpResponse, body) {
							  if (err) {
							    return console.error('upload failed:', err);
							  }
					});
				})
			}

		}
	}
	else {
		return {
			homeDir: function() {console.log("not in electron");},
			listDir: function(path) {console.log("not in electron");},
			watchFile: function(path, callback) {console.log("not in electron");},
			unwatchFile: function(path) {console.log("not in electron");},
			writeFileImpl: function(path, bytes){console.log("not in electron");},
			readFileImpl: function(path, bytes){console.log("not in electron");}
		}
	}
})