const { io } = require('./server');

const Orb = require('./sockets/classes/Orb');
const Player = require('./sockets/classes/Player');
const PlayerData = require('./sockets/classes/PlayerData');
const PlayerConfig = require('./sockets/classes/PlayerConfig');

const {
  checkForOrbCollisions,
  checkForPlayerCollisions,
} = require('./sockets/collisions');

const orbs = [];
const players = [];

const settings = {
  defaultOrbs: 5000,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000,
};

function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

initGame();

// issue a message to every connected socket 30 fps, every 33 milliseconds
setInterval(() => {
  if (players.length) {
    io.to('game').emit('tock', {
      players,
    });
  }
}, 33);

io.on('connect', (socket) => {
  let player = {};

  socket.on('init', (data) => {
    socket.join('game');

    const playerConfig = new PlayerConfig(settings);
    const playerData = new PlayerData(data.playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);

    // issue a message to every connected socket 30 fps, every 33 milliseconds
    setInterval(() => {
      socket.emit('tickTock', {
        playerX: player.playerData.locX,
        playerY: player.playerData.locY,
      });
    }, 33);

    socket.emit('initReturn', { orbs });

    players.push(playerData);
  });

  socket.on('tick', (data) => {
    const speed = player.playerConfig.speed;
    player.playerConfig.xVector = data.xVector;
    player.playerConfig.yVector = data.yVector;

    const xV = player.playerConfig.xVector;
    const yV = player.playerConfig.yVector;

    if (
      (player.playerData.locX < 5 && player.playerConfig.xVector < 0) ||
      (player.playerData.locX > settings.worldWidth && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > settings.worldHeight && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }

    const capturedOrb = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );

    capturedOrb
      .then((data) => {
        // emit to all sockets the orb to replace
        const orbData = {
          orbIndex: data,
          newOrb: orbs[data],
        };

        io.sockets.emit('leaderboard', getLeaderboard());

        io.sockets.emit('orbSwitch', orbData);
      })
      .catch(() => {
        // console.log('no collision');
      });

    const playerDeath = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      player.socketId
    );

    playerDeath
      .then((data) => {
        io.sockets.emit('leaderboard', getLeaderboard());
        io.sockets.emit('death', data);
      })
      .catch(() => {});
  });

  socket.on('disconnect', (data) => {
    players = players.filter((p) => p.socketId !== player.socketId);
  });
});

function getLeaderboard() {
  players.sort((a, b) => b.score - a.score);

  return players.map((player) => {
    return {
      name: player.name,
      score: player.score,
    };
  });
}
