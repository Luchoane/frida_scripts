Java.perform(function () {
  var System = Java.use('java.lang.System');
  var Proxy = Java.use('java.net.Proxy');
  var InetSocketAddress = Java.use('java.net.InetSocketAddress');
  var URL = Java.use('java.net.URL');
  var HttpURLConnection = Java.use('java.net.HttpURLConnection');
  var originalOpenConnection = URL.openConnection.overload().implementation;
  
  URL.openConnection.overload('java.net.Proxy').implementation = function (proxy) {
    return originalOpenConnection.call(this, proxy);
  };
  
  URL.openConnection.overload('java.net.Proxy').implementation = function (proxy) {
    var host = '192.168.0.100';
    var port = 8080;
    var inetSocketAddress = InetSocketAddress.$new(host, port);
    var httpProxy = Proxy.$new(Proxy.Type.HTTP, inetSocketAddress);
    return originalOpenConnection.call(this, httpProxy);
  };
});
