const socket = io.connect('http://localhost:5000');

function init() {
  draw();

  socket.emit('init', {
    playerName: player.name,
  });
}

socket.on('initReturn', (data) => {
  orbs = data.orbs;

  setInterval(() => {
    socket.emit('tick', {
      xVector: player.xVector || 0,
      yVector: player.yVector || 0,
    });
  }, 33);
});

socket.on('tock', (data) => {
  players = data.players;
  player.locX = data.playerX;
  player.locY = data.playerY;
});
