class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
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
    this._canvas = document.createElement("canvas")
    this._canvas.width = 700
    this._canvas.height = 600
    this._canvas.id = 'pong'
    this._context = this._canvas.getContext('2d')
    this.ball = new Ball(20, 20)
    this.players = null

  }

  drawElements() {
    this._context.fillStyle = '#000'
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height)

    this.drawRectangle(this.ball)
    this.players.forEach( player => this.drawRectangle(player) )
  }

  drawRectangle(rectangle) {
    this._context.fillStyle = '#FFF'
    this._context.fillRect(rectangle.left, rectangle.top, rectangle.size.x, rectangle.size.y)
  }

  collision(player, ball) {
    if(player.left < ball.right && player.right > ball.left && 
      player.top < ball.bottom && player.bottom > ball.top) {
      ball.speed.x = -ball.speed.x
    }
  }

  updatePlayersPaddles(player) {
    if (player.keyState[player.moveUp]) {
      player.position.y += 7
    }
    if (player.keyState[player.moveDown]) {
      player.position.y -= 7
    }
    player.position.y = Math.max(Math.min(player.position.y, this._canvas.height - (player.size.y / 2)), (player.size.y / 2));
  }

  serveBall() {
    this.ball.position.x = 80
    this.ball.position.y = 80
    this.ball.speed.x = 300
    this.ball.speed.y = 300 
    this.ball.speed.length = 300
  }

  update(deltaTime) {
    this.ball.position.x += this.ball.speed.x * deltaTime
    this.ball.position.y += this.ball.speed.y * deltaTime

    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      this.ball.speed.x = -this.ball.speed.x
    }
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.speed.y = -this.ball.speed.y
    }

    this.players.forEach(player => {
      this.updatePlayersPaddles(player)
      this.collision(player, this.ball)
    })

    this.drawElements();
  }

  createPlayers() {
    this.players = [new Player(87, 83), new Player(38, 40)]
    this.players[0].position.x = 40;
    this.players[1].position.x = this._canvas.width - 40;

    document.addEventListener('keydown', (event) => {
      this.players.forEach(player => player.keyState[event.keyCode] = true)
      })
      
    document.addEventListener('keyup', (event) => {
      this.players.forEach(player => delete player.keyState[event.keyCode])
    })

    this.players.forEach(player => player.position.y = this._canvas.height / 2)
    return this
  }

  startLoop() {
    let lastTime
    const callback = (currentTime) => {
      if (lastTime) {
        this.update((currentTime - lastTime) / 1000)
      }
      lastTime = currentTime
      requestAnimationFrame(callback)
    }
    callback()
    return this
  }

  init() {
    if (document.querySelector('#pong') === null) {
      document.querySelector("#canvasWrapper").appendChild(this._canvas);
    }
    this.createPlayers().startLoop().serveBall()
       
  }

}

window.addEventListener('DOMContentLoaded', () => {
  const pong = new Pong().init();
})
