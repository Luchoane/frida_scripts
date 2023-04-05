Java.perform(function() {
  var SSLContext = Java.use("javax.net.ssl.SSLContext");
  var X509TrustManager = Java.use("javax.net.ssl.X509TrustManager");
  var HostnameVerifier = Java.use("javax.net.ssl.HostnameVerifier");
  var HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");
  var SSLContext_init = SSLContext.init.overload('[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom');
  var X509TrustManager_checkServerTrusted = X509TrustManager.checkServerTrusted;
  var HostnameVerifier_verify = HostnameVerifier.verify;

  var BurpProxy = Java.use("com.android.okhttp.Proxy").$new("192.168.0.100", 8080);
  var ProxySelector = Java.use("java.net.ProxySelector");
  var Arrays = Java.use("java.util.Arrays");
  var Collections = Java.use("java.util.Collections");
  var List = Java.use("java.util.List");
  var Uri = Java.use("android.net.Uri");
  var Proxy = Java.use("java.net.Proxy");
  var InetSocketAddress = Java.use("java.net.InetSocketAddress");

  var trustAllCerts = Java.array('Ljavax.net.ssl.X509TrustManager;', [X509TrustManager.$new({
      checkClientTrusted: function() {},
      checkServerTrusted: function() {},
      getAcceptedIssuers: function() { return []; }
  })]);

  SSLContext_init.implementation = function(keyManager, trustManager, secureRandom) {
      SSLContext_init.call(this, keyManager, trustAllCerts, secureRandom);
  };

  X509TrustManager.checkServerTrusted.overload('[Ljava.security.cert.X509Certificate;', 'java.lang.String').implementation = function(chain, authType) {
      // Trust any server certificate
      return;
  };

  HostnameVerifier.verify.overload('java.lang.String', 'javax.net.ssl.SSLSession').implementation = function(hostname, session) {
      // Trust any hostname
      return true;
  };

  HttpsURLConnection.setDefaultHostnameVerifier(HostnameVerifier.$new());
  HttpsURLConnection.setDefaultSSLSocketFactory(SSLContext.getDefault().getSocketFactory());

  var originalOpenConnection = HttpsURLConnection.openConnection.overload().implementation;
  HttpsURLConnection.openConnection.overload('java.net.URL', 'java.net.Proxy').implementation = function(url, proxy) {
      var connection;
      if (proxy) {
          connection = originalOpenConnection.call(this, url, BurpProxy);
      } else {
          connection = originalOpenConnection.call(this, url, null);
      }
      return connection;
  };

  var originalGetDefault = ProxySelector.getDefault.implementation;
  ProxySelector.getDefault.implementation = function() {
      return {
          select: function(uri) {
              var uriString = uri.toString();
              if (uriString.startsWith("https:")) {
                  return Collections.singletonList(BurpProxy);
              } else {
                  return originalGetDefault.call(this).select(uri);
              }
          },
          connectFailed: function(uri, sa, ioe) {
              return;
          }
      };
  };

});
