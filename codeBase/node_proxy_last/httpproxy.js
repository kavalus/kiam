var http = require('http'),
      httpProxy = require('http-proxy'),
      HttpProxyRules = require('http-proxy-rules');
 
  // Set up proxy rules instance
  var proxyRules = new HttpProxyRules({
    rules: {
      '.*/demo': 'http://localhost:80/demo/', // Rule (1)
      '.*/app1.html': 'http://localhost:80/app1.html', // Rule (2)
      '.*/app2.html': 'http://localhost:80/app2.html', // Rule (3)
      '.*/demo/faq.html': 'http://localhost:80//demo/faq.html', // Rule (4)
    },
    default: 'http://localhost:80' // default target
  });
 
  // Create reverse proxy instance
  var proxy = httpProxy.createProxy();
 
  // Create http server that leverages reverse proxy instance
  // and proxy rules to proxy requests to different targets
  http.createServer(function(req, res) {
 
    // a match method is exposed on the proxy rules instance
    // to test a request to see if it matches against one of the specified rules
    
    var target = proxyRules.match(req);
    if (target) {
      return proxy.web(req, res, {
        target: target
      });
    }
 
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('The request url and path did not match any of the listed rules!');
  }).listen(3000);