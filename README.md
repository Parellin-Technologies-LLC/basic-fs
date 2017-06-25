# basic-fs
A very simple internal file system API for any computer. Builds out compiled versions to MacOS, Linux, and Windows.

Download a [#release][0] to run locally.

### **Recommended for LOCAL AREA NETWORK ONLY**

Use case:
    - "Air drop" for Mac to PC/Linux
    - Stream write or send files (perhaps log files) to another machine on your network




[0]: https://github.com/Parellin-Technologies-LLC/basic-fs/

{
	"name": "rdpfox-onboard-client",
	"author": "Parellin Technologies LLC",
	"version": "0.0.1",
	"description": "A Remote Desktop Protocol Client written in javascript",
	"license": "GPL-v3.0",
	"repository": {
		"type": "git",
		"url": "https://github.com/parellin/rdpfox-onboard-client.git"
	},
	"main": "server.js",
	"dependencies": {
		"express": "^4.15.3",
		"letsencrypt": "^2.1.8",
		"node-rdpjs": "^0.3.0",
		"public-ip": "^2.3.5",
		"socket.io": "^1.3.7"
	},
	"scripts": {
		"start": "node server.js",
		"pkg": "pkg . -b --out-path pkg/"
	},
	"cozy-permissions": {},
	"cozy-displayName": "rdpfox-onboard-client",
	"icon-path": "client/img/mstsc.js.svg",
	"devDependencies": {
		"html-webpack-plugin": "^2.28.0",
		"webpack": "^2.6.1"
	},
	"bin": "server.js",
	"pkg": {
		"assets": [
			"node_modules/**/*",
			"server/**/*",
			"obj/**/*",
			"img/**/*",
			"client/**/*"
		],
		"targets": [
			"node8"
		]
	}
}
