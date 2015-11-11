var express = require('express.io');
var app = express().http().io();

// Serve `public` directory.
app.use(express.static('public'));

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on http://localhost:%s', port);

// General message broadcasting for misc things.
app.io.route('msg', function (req) {
  req.io.broadcast('msg', req.data);
});

// TODO: Do proper pub-sub for each example (e.g., separate rooms for `draw`).
app.io.route('draw:msg', function (req) {
  req.io.broadcast('draw:msg', req.data);
});
