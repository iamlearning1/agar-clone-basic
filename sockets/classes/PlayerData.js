class PlayerData {
  constructor(name, settings) {
    this.name = name;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 10);
    this.locY = Math.floor(settings.worldHeight * Math.random() + 10);
    this.radius = settings.defaultSize;
    this.color = this.getRandomColor();
    this.score = 0;
    this.orbsAbsorbed = 0;
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`;
  }
}

module.exports = PlayerData;
