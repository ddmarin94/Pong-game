class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
  // hipotenusa of the vector, give consistens at ball speed
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  set length(value) {
    const multiplicationFactor = value / this.length
    this.x *= multiplicationFactor
    this.y *= multiplicationFactor
  }

}

class Rectangle {
  constructor(rectangleWidth, rectangleHeight) {
    this.position = new Vector()
    this.size = new Vector(rectangleWidth, rectangleHeight)
  }

  get left() {
    return this.position.x - this.size.x / 2
  }

  get right() {
    return this.position.x + this.size.x / 2
  }

  get top() {
    return this.position.y - this.size.y / 2
  }

  get bottom() {
    return this.position.y + this.size.y / 2
  }

}

class Ball extends Rectangle {
  constructor(ballWidth, ballHeight) {
    super(ballWidth, ballHeight);
    this.speed = new Vector();
  }
}

class Player extends Rectangle {
  constructor(moveDown, moveUp) {
    super(15, 100)
    this.score = 0
    this.moveDown = moveDown
    this.moveUp = moveUp
    this.keyState = {}
  }
}

class Pong {
  constructor() {
    this._canvas = document.createElement("canvas");
    this._canvas.width = 700;
    this._canvas.height = 600;
    this._canvas.id = "pong";
    this._context = this._canvas.getContext("2d");
    this.ball = new Ball(20, 20);
    this.players = null;
    this.numberCharacterPixelSize = 10;

    this.numbers = [
      "111101101101111",
      "010010010010010",
      "111001111100111",
      "111001111001111",
      "101101111001001",
      "111100111001111",
      "111100111101111",
      "111001001001001",
      "111101111101111",
      "111101111001111"
    ]
  }

  _drawNet() {
    const w = 4;
    const x = (this._canvas.width - w) * 0.5;
    let y = 0;
    const step = this._canvas.height / 20;
    while (y < this._canvas.height) {
      this._context.fillStyle = "#FFF";
      this._context.fillRect(x, y + step * 0.25, w, step * 0.5);
      y += step;
    }
    return this;
  }

  _drawElements() {
    this._context.fillStyle = "#000";
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this._drawNet();
    this._drawRectangle(this.ball);
    this.players.forEach(player => this._drawRectangle(player));
    this._drawScore();
  }

  _drawRectangle(rectangle) {
    this._context.fillStyle = "#FFF";
    this._context.fillRect(rectangle.left, rectangle.top, rectangle.size.x, rectangle.size.y);
  }

  _collision(player, ball) {
    if (player.left < ball.right && player.right > ball.left &&
      player.top < ball.bottom && player.bottom > ball.top) { 
      ball.speed.x = -ball.speed.x;
      ball.speed.length *= 1.05;
    }

  }

  _updatePlayersPaddles(player) {
    if (player.keyState[player.moveUp]) {
      player.position.y += 7;
    }
    if (player.keyState[player.moveDown]) {
      player.position.y -= 7;
    }
    player.position.y = Math.max(
      Math.min(player.position.y, this._canvas.height - player.size.y / 2),
      player.size.y / 2
    );
  }

  _serveBall() {
    this.ball.position.x = 80;
    this.ball.position.y = 80;
    this.ball.speed.x = 300;
    this.ball.speed.y = 300;
    this.ball.speed.length = 300;
    return this;
  }

  _update(deltaTime) {
    this.ball.position.x += this.ball.speed.x * deltaTime;
    this.ball.position.y += this.ball.speed.y * deltaTime;

    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.speed.y = -this.ball.speed.y;
    }

    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      let playerId = (this.ball.speed.x < 0) | 0;
      this.players[playerId].score++;
      this._serveBall();
    }

    this.players.forEach(player => {
      this._updatePlayersPaddles(player);
      this._collision(player, this.ball);
    });

    this._drawElements();
  }

  _createPlayers() {
    this.players = [new Player(87, 83), new Player(38, 40)];
    this.players[0].position.x = 40;
    this.players[1].position.x = this._canvas.width - 40;

    document.addEventListener("keydown", event => {
      this.players.forEach(player => (player.keyState[event.keyCode] = true));
    });
    document.addEventListener("keyup", event => {
      this.players.forEach(player => delete player.keyState[event.keyCode]);
    });

    this.players.forEach(
      player => (player.position.y = this._canvas.height / 2)
    );
    return this;
  }

  _startLoop() {
    let lastTime;
    const callback = currentTime => {
      if (lastTime) {
        this._update((currentTime - lastTime) / 1000);
      }
      lastTime = currentTime;
      requestAnimationFrame(callback);
    };
    callback();
    return this;
  }

  _drawScore() {
    const alignScoreBoard = this._canvas.width / 3
    const scoreBoardWidth = this.numberCharacterPixelSize * 4;
    this.players.forEach((player, index) => {
      const characters = player.score.toString().split("");
      const offset = alignScoreBoard * (index + 1) - scoreBoardWidth * characters.length / 2 + this.numberCharacterPixelSize / 2;
      characters.forEach((char, position) => {
        this._context.drawImage(
          this.numbers[char | 0],
          offset + position * scoreBoardWidth,
          20
        );
      });
    });
  }

  _createScoreBoard() {
    this.numbers = this.numbers.map(numberStr => {
      const scoreBoardCanvas = document.createElement("canvas");
      scoreBoardCanvas.height = 5 * this.numberCharacterPixelSize;
      scoreBoardCanvas.width = 3 * this.numberCharacterPixelSize;
      const context = scoreBoardCanvas.getContext("2d");
      context.fillStyle = "#fff";
      numberStr.split("").forEach((element, index) => {
        if (element === "1") {
          context.fillRect(
            (index % 3) * this.numberCharacterPixelSize, 
            ((index / 3) | 0) * this.numberCharacterPixelSize, 
            this.numberCharacterPixelSize, 
            this.numberCharacterPixelSize
          );
        }
      });
      return scoreBoardCanvas;
    });
  }

  _insertCanvasInDOM() {
    document.querySelector("#canvasWrapper").appendChild(this._canvas);
    return this;
  }

  init() {
    this
      ._insertCanvasInDOM()
      ._createPlayers()
      ._startLoop()
      ._serveBall()
      ._createScoreBoard();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const pong = new Pong().init();
})
