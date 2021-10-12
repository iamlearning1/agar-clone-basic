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
});

socket.on('orbSwitch', (data) => {
  orbs.splice(data.orbIndex, 1, data.newOrb);
});

socket.on('tickTock', (data) => {
  player.locX = data.playerX;
  player.locY = data.playerY;
});

socket.on('leaderboard', (data) => {
  document.querySelector('.leader-board').innerHTML = '';

  data.forEach((player) => {
    document.querySelector('.leader-board').innerHTML += `
  <li class="leaderboard-player">${player.name} - ${player.score}</li>
  `;
  });
});

socket.on('death', (data) => {
  console.log('Death', data);
});
