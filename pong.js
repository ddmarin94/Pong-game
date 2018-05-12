class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}

class Rectangles {
  constructor(paddleWidth, paddleHeight) {
    this.position = new Vector()
    this.size = new Vector(paddleWidth, paddleHeight)
  }

}

class Ball extends Rectangles {
  constructor() {
    super(15, 15)
    this.speed = new Vector()
  }
}

class Pong {
  constructor() {
    this._canvas = document.createElement("canvas")
    this._canvas.width = 700
    this._canvas.height = 600
    this._canvas.id = 'pong'
    this._context = this._canvas.getContext('2d')
    this.ball = new Ball
    this.ball.position.x = 0
    this.ball.position.y = 0
    this.ball.speed.x = 150
    this.ball.speed.y = 150
    
    if(document.querySelector('#pong') === null) {
      document.body.appendChild(this._canvas);      
    }

    let lastTime
    const callback = (currentTime) => {
      if (lastTime) {
        this.update((currentTime - lastTime) / 1000);
      }
      lastTime = currentTime;
      requestAnimationFrame(callback)
    };
    callback()
  }

  update(deltaTime) {
    this.ball.position.x += this.ball.speed.x * deltaTime
    this.ball.position.y += this.ball.speed.y * deltaTime

    if (this.ball.position.x < 0 || this.ball.position.x > (this._canvas.width - this.ball.size.x)) {
      this.ball.speed.x = -this.ball.speed.x
    }
    if (this.ball.position.y < 0 || this.ball.position.y > (this._canvas.height - this.ball.size.y)) {
      this.ball.speed.y = -this.ball.speed.y
    }

    this._context.fillStyle = '#000'
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height)

    this._context.fillStyle = '#FFF'
    this._context.fillRect(this.ball.position.x, this.ball.position.y, this.ball.size.x, this.ball.size.y)
  }

}



window.addEventListener('DOMContentLoaded', () => {
  const pong = new Pong()
})
