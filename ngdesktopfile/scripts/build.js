var AdmZip = require('adm-zip');

// creating archives
var zip = new AdmZip();

zip.addLocalFolder("./META-INF/", "/META-INF/");
zip.addLocalFolder("./dist/servoy/ngdesktopfile/", "/dist/servoy/ngdesktopfile/");
zip.addLocalFolder("./ngdesktopfile/", "/ngdesktopfile/");
zip.writeZip("ngdesktopfile.zip");