(function () {

// Adapted from this awesome example: https://github.com/techpines/express.io/tree/master/examples/realtime-canvas

function resizeFull () {
  // Make it visually fill the positioned parent.
  this.style.width = '100%';
  this.style.height = '100%';

  // Set the internal size to match.
  this.height = window.innerHeight;
  this.width = window.innerWidth;
}

var App = {
  namespace: 'draw'
};

App.socket = io.connect('http://localhost:3000');
App.socketKey = App.namespace + ':msg';

App.emit = function (type, data) {
  App.socket.emit(App.socketKey, {
    type: type,
    data: data,
    source: App.namespace
  });
};

App.on = function (type, cb) {
  App.socket.on(App.socketKey, function (msg) {
    if (msg.type !== type) { return; }
    cb(msg.data);
  });
};

App.draw = function (data) {
  console.log('draw', data);
  App.ctx.lineWidth = 5;
  if (data.type === 'dragstart') {
    App.ctx.beginPath();
    App.ctx.moveTo(data.x, data.y);
  } else if (data.type === 'drag') {
    App.ctx.lineTo(data.x, data.y);
    App.ctx.stroke();
  } else {
    App.ctx.stroke();
    App.ctx.closePath();
  }
};

// Draw from other sockets
App.on('drawClick', App.draw);

App.clearCanvas = function () {
};

App.init = function () {
  if (App.canvas) { return; }

  App.canvas = document.createElement('canvas');
  App.canvas.id = 'skydrawCanvas';
  App.canvas.className = 'canvas--full';
  document.body.appendChild(App.canvas);

  // Resize canvas when page loads or is resized.
  var setCanvasSize = resizeFull.bind(App.canvas);

  function resizeCanvasSize () {
    // TODO: Handle resize better.
    var scaledWidth = App.canvas.width / window.innerWidth;
    var scaledHeight = App.canvas.height / window.innerHeight;
    App.ctx.scale(scaledWidth, scaledHeight);
  }

  window.addEventListener('load', setCanvasSize);
  window.addEventListener('resize', resizeCanvasSize);
  setCanvasSize();

  // Broadcast when we leave the page.
  window.addEventListener('beforeunload', App.clearCanvas);

  App.canvas = $('canvas')[0];
  App.ctx = App.canvas.getContext('2d');
  $(App.canvas).live('drag dragstart dragend', function (e) {
    offset = $(this).offset();
    data = {
      x: (e.clientX - offset.left),
      y: (e.clientY - offset.top),
      type: e.handleObj.type
    };
    App.draw(data);  // Draw yourself.
    App.emit('drawClick', data);  // Broadcast draw.
  });
};

App.init();

})();
