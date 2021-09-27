const height = $(window).height();
const width = $(window).width();

const player = {};

const canvas = document.querySelector('#the-canvas');
const context = canvas.getContext('2d');

canvas.height = height;
canvas.width = width;

$(window).load(() => {
  $('#loginModal').modal('show');
});

$('.name-form').submit((event) => {
  event.preventDefault();

  player.name = document.querySelector('#name-input').value;

  $('#loginModal').modal('hide');
  $('#spawnModal').modal('show');
  document.querySelector('.player-name').innerHTML = player.name;
});

$('.start-game').click(() => {
  $('.modal').modal('hide');
  $('.hiddenOnStart').removeAttr('hidden');
  init();
});
