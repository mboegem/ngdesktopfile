{
	"name": "ngdesktopfile",
	"displayName": "NGDesktop File",
	"version": 1,
 	"definition": "ngdesktopfile/ngdesktopfile/ngdesktopfile.js",
	"serverscript":"ngdesktopfile/ngdesktopfile/ngdesktopfile_server.js",
 	"api":
 	{
	   	"homeDir": {
			"returns":"string"
		},
		"tmpDir": {
			"returns":"string"
		},
		"listDir": {
			"parameters" : [
				{"name":"path", "type":"string"}
			],
			"returns":"string[]"
		},
		"watchFile": {
			"parameters" : [
				{"name":"path", "type":"string"},
				{"name":"callback", "type":"function"}
			],
			"async-now":true
		},
		"unwatchFile": {
			"parameters" : [
				{"name":"path", "type":"string"}
			],
			"async-now":true
		},
		"writeFile": {
			"parameters" : [
				{"name":"path", "type":"string"},
				{"name":"bytes", "type":"byte[]"}
			],
			"async-now":true
		},
		"readFile": {
			"parameters" : [
				{"name":"path", "type":"string", "optional": true},
				{"name":"callback", "type":"function"}
			],
			"async-now":true
		},
		"deleteFile": {
		 	"parameters": [
		 		{"name":"path", "type":"string"},
		 		{"name":"errorCallback", "type":"function", "optional": true}
		 	],
		 	"async-now":true
		},
		 "getFileStats": {
		 	"parameters": [
		 		{"name":"path", "type":"string"}
		 	],
		 	"returns": "stats"
		 }
	},
 	"internalApi": {
 		"writeFileImpl": {
			"parameters" : [
				{"name":"path", "type":"string"},
				{"name":"url", "type":"string"}
			],
			"async-now":true
		},
		"readFileImpl": {
			"parameters" : [
				{"name":"path", "type":"string"},
				{"name":"key", "type":"string"}
			],
			"async-now":true
		},
		"callback": {
			"parameters" : [
				{"name":"file", "type":"object"},
				{"name":"fields", "type":"object"}
			]
		}
 	},
 	"types": {
		"stats": {
			"isBlockDevice": {"type": "boolean", "default": false},
			"isCharacterkDevice": {"type": "boolean", "default": false},
			"isDirectory": { "type": "boolean", "default": false},
			"isFIFO": { "type": "boolean", "default": false},
			"isFile": { "type": "boolean", "default": false},
			"isSocket": { "type": "boolean", "default": false},
			"isSymbolicLink": { "type": "boolean", "default": false},
			"dev": { "type": "long", "default": 0},
			"ino": { "type": "long"},
			"mode": { "type": "long"},
			"nlink": { "type": "long"}, 
			"uid": { "type": "long"},
			"gid": { "type": "long"},
			"rdev": { "type": "long"},
			"size": { "type": "long"},
			"blksize": { "type": "long"},
			"blocks": { "type": "long"},
			"atimeMs": { "type": "long"},
			"mtimeMs": { "type": "long"},
			"ctimeMs": { "type": "long"},
			"birthtimeMs": { "type": "long"},
			"atime": { "type": "date"},
			"mtime": { "type": "date"},
			"ctime": { "type": "date"}, 
			"birthtime": { "type": "date" }
		}
	}
}