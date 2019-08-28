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
				{"name":"path", "type":"string"},
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
				{"name":"path", "type":"string"}
			],
			"async-now":true
		},
		"callback": {
			"parameters" : [
				{"name":"file", "type":"object"},
				{"name":"fields", "type":"object"}
			]
		}
 	}
}