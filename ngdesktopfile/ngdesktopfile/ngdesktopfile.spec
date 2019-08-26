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
			]
		},
		"unwatchFile": {
			"parameters" : [
				{"name":"path", "type":"string"}
			]
		},
		"writeFile": {
			"parameters" : [
				{"name":"path", "type":"string"},
				{"name":"bytes", "type":"byte[]"}
			]
		},
		"readFile": {
			"parameters" : [
				{"name":"path", "type":"string"},
				{"name":"callback", "type":"function"}
			]
		},
		"deleteFile": {
		 	"parameters": [
		 		{"name":"path", "type":"string"}
		 	]
		 }
	},
 	"internalApi": {
 		"writeFileImpl": {
			"parameters" : [
				{"name":"path", "type":"string"},
				{"name":"url", "type":"string"}
			]
		},
		"readFileImpl": {
			"parameters" : [
				{"name":"path", "type":"string"}
			]
		},
		"callback": {
			"parameters" : [
				{"name":"file", "type":"object"},
				{"name":"fields", "type":"object"}
			]
		}
 	}
}