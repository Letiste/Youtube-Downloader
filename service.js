let Service = require('node-windows').Service;

// Create a new service object
let svc = new Service({
  name:'Youtube Downloader',
  description: 'Script to download Youtube Videos as audio file.',
  script: 'D:\\Documents\\userscripts\\youtube-downloader\\main.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
  svc.install()
});


svc.uninstall();

if (!svc.exists) {
  svc.install();
}
