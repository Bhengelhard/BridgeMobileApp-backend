// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_tl77vlq9:ev4kktfeb05jnbtvcmc39ljr68@ds021956-a0.mlab.com:21956,ds021956-a1.mlab.com:21956/heroku_tl77vlq9?replicaSet=rs-ds021956',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'mybridgeapp3498735421846jhlkjsdhf23d',
  masterKey: process.env.MASTER_KEY || 'euchnfbe73723ndn77sdkj3763', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://mybridgeapp.herokuapp.com/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
  push: {
    android: {
        senderId: '...',
        apiKey: '...'
    },
    ios: [
    {
        pfx: 'Parse_Push_Notifications_Distribution_Certificate.p12',
        passphrase: 'necter@123', // optional password to your p12/PFX
        bundleId: 'com.Bridge.Beta',
        production: true
    },
    {
        pfx: 'Parse_Push_Notifications_Distribution_Certificate.p12',
        passphrase: 'necter@123', // optional password to your p12/PFX
        bundleId: 'com.Bridge.Beta',
        production: false
    }
    ]
 }
});

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
