angular.module('ngdesktopfile',['servoy'])
.factory("ngdesktopfile",function($services, $q, $window,$utils) 
{
	var fs = null;
	var request = null;
	var session = null;
	var dialog = null;
	var remote = null;
	
	if (typeof require == "function") {
		fs = require('fs');
		chokidar = require('chokidar');
		request = require('request');
		remote = require('electron').remote;
		session = remote.session;
		dialog = remote.dialog;
		
		var j = request.jar();
		request = request.defaults({jar:j});
		// Query all cookies.
		session.defaultSession.cookies.get({url:remote.getCurrentWebContents().getURL()})
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
			watchDir: function(path, callback) {
				// Initialize watcher
				const watcher = chokidar.watch(path, {
				  ignoreInitial: true,
				  alwaysStat: true
				});
				waitForDefered(function() {
					watcher.on('add', function(path, stats) {
						$window.executeInlineScript(callback.formname, callback.script, [path]);
					}).on('addDir', function(path, stats) {
						$window.executeInlineScript(callback.formname, callback.script, [path]);
					}).on('change', function(path, stats) {
						// For MacOS: Do not make the callback when .DS_Store is changed. 
						if (!path.includes(".DS_Store")) {
							$window.executeInlineScript(callback.formname, callback.script, [path]);
						}
					}).on('unlink', function(path) {
						$window.executeInlineScript(callback.forname, callback.script, [path]);
					}).on('unlinkDir', function(path) {
						$window.executeInlineScript(callback.formname, callback.script, [path]);
					});
				});
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
			 * then those are made. If the path is missing or contain only the file name then the  
			 * native system dialog for saving files it is called.
			 * Please use forward slashes (/) instead of backward slashes in the path/filename
			 */
			writeFile: function(path, bytes) {
				// empty impl, is implemented in server side api calling the impl method below.
			},
			writeFileImpl: function(path, url) {
				waitForDefered(function() {
					function saveUrlToPath(dir, realPath) {
					    fs.mkdir(dir, { recursive: true }, function(err) {
					    	if (err) {
					    		defer.resolve(false);
								defer = null;
								throw err;
					    	}
					    	else {
								const pipe = request(getFullUrl(url)).pipe(fs.createWriteStream(realPath));
								pipe.on("error", function(err) {
									defer.resolve(false);
									defer = null;
									throw err;
								});
								pipe.on("close", function() {
									defer.resolve(true);
									defer = null;
								});
					    	}
						});
					}
					defer = $q.defer();
					path = (path != null) ? path : "";
				    var dir = path;
				    var index = path.lastIndexOf("/");
				    if (index >= 0) {
				    	dir = path.substring(0,index);
				    	saveUrlToPath(dir, path);
				    } else {
				    	var options = {
			                title: "Save file",
			                defaultPath : path,
			                buttonLabel : "Save"
			               }
				    	dialog.showSaveDialog(remote.getCurrentWindow(), options)
						.then(function(result) {
				    		 if (!result.canceled) {
				    			 var realPath = result.filePath.replace(/\\/g, "/"); //on Windows the path contains backslash
					    		 var index = realPath.lastIndexOf("/");
								 if (index > 0) {
								 	dir = realPath.substring(0,index);
								    saveUrlToPath(dir,realPath);
								 } else {
									defer.resolve(false);
									defer = null;
								 }
				    		 } else {
				    			defer.resolve(true);
								defer = null;
				    		 }
				    	}).catch(function(err) {
				    		console.log(err);
				    		defer.resolve(false);
							defer = null;
				    	});
				    }
				})
			},
			/**
			 * Reads the given bytes of a path, the callback is a function that will get as parameters the 'path' as a String and the 'file' as a JSUpload object
			 * If the path is missing or contain only the file name then the native system dialog for opening files it is called.
			 * Please use forward slashes (/) instead of backward slashes in the path/filename
			 * 
			 */
			readFile: function(callback, path) {
				// empty impl, is implemented in server side api calling the impl method below.
			},
			readFileImpl: function(path, id) {
				waitForDefered(function() {
					function readUrlFromPath(path, id) {
						var formData = {
							path: path,
							id: id,
							file: fs.createReadStream(path)
						};
						request.post({url:getFullUrl($utils.generateServiceUploadUrl("ngdesktopfile", "callback")), formData: formData},
							function optionalCallback(err, httpResponse, body) {
								  if (err) {
								    return console.error('upload failed:', err);
								  }
						});
					}
					
					path = (path != null) ? path : "";
					if (path.lastIndexOf("/") >= 0) {
						readUrlFromPath(path, id)
					} else {
						var options = {
			                title: "Open file",
			                defaultPath : path,
			                buttonLabel : "Open"
			            }
						dialog.showOpenDialog(remote.getCurrentWindow(), options)
						.then(function(result) {
							if (!result.canceled) {
								readUrlFromPath(result.filePaths[0].replace(/\\/g, "/"), id); //on Windows the path contains backslash
							} 
						}).catch(function(err) {
							console.log(err);
						})
					}					
				})
			},
			deleteFile: function(path, errorCallback) {
				waitForDefered(function() {
					fs.unlink(path, function(err) {
						if (err && errorCallback) $window.executeInlineScript(errorCallback.formname, errorCallback.script, [err]);
					});
				})
			},
			/**
			 * Return a 'stats' object containing related file's information's.
			 * Please use forward slashes (/) instead of backward slashes in the path
			 * 
			 * @return {stats}
			 */
			getFileStats: function(path) {
				try {
					var fsStats = fs.statSync(path);
					if (fsStats.isSymbolicLink()) {
						fsStats = fs.lStatSync(path);
					}
					var retStats = {
						"isBlockDevice": fsStats.isBlockDevice(),
						"isCharacterDevice": fsStats.isCharacterDevice(),
						"isDirectory": fsStats.isDirectory(),
						"isFIFO": fsStats.isFIFO(),
						"isFile": fsStats.isFile(),
						"isSocket": fsStats.isSocket(),
						"isSymbolicLink": fsStats.isSymbolicLink(),
						"dev": fsStats.dev,
						"ino": fsStats.ino,
						"mode": fsStats.mode,
						"nlink": fsStats.nlink,
						"uid": fsStats.uid,
						"gid": fsStats.gid,
						"rdev": fsStats.rdev,
						"size": fsStats.size,
						"blksize": fsStats.blksize,
						"blocks": fsStats.blocks,
						"atimeMs": fsStats.atimeMs,
						"mtimeMs": fsStats.mtimeMs,
						"ctimeMs": fsStats.ctimeMs,
						"birthtimeMs": fsStats.birthtimeMs
					};
					return retStats;
				}
				catch(err) {
					console.log(err);
				}
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
			readFileImpl: function(path, id, bytes){console.log("not in electron");},
			deleteFile: function(path, errorCallback){console.log("not in electron");}
		}
	}
})