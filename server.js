/*const prerender = require('prerender');
const server = prerender();
server.start();*/



 
const prerender = require('prerender');
var server = prerender({
  chromeLocation: '/usr/bin/chromium-browser'
});

server.use(prerender.sendPrerenderHeader());
// server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.start();