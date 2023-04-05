Java.perform(function () {
    var URL = Java.use("java.net.URL");
    var HttpURLConnection = Java.use("java.net.HttpURLConnection");

    URL.$init.overload('java.lang.String').implementation = function (url) {
        console.log("URL: " + url);

        // Redirect traffic to proxy
        var proxyUrl = "http://192.168.0.100:8080";
        url = url.replace("https://", proxyUrl + "/https/");
        url = url.replace("http://", proxyUrl + "/http/");

        return this.$init(url);
    };

    HttpURLConnection.openConnection.implementation = function () {
        console.log("openConnection");

        // Set proxy for the connection
        var proxy = Java.use("java.net.Proxy").$new(
            Java.use("java.net.Proxy$Type").valueOf("HTTP"),
            Java.use("java.net.InetSocketAddress").$new("192.168.0.100", 8080)
        );
        return this.openConnection(proxy);
    };
});
