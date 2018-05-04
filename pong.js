class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}

class Paddles {
  constructor(paddleWidth, paddleHeight) {
    this.position = new Vector()
    this.size = new Vector(paddleWidth, paddleHeight)
  }

  get left() {
    return this.position.x - (this.position.x / 2)
  }

  get right() {
    return this.position.x + (this.position.x / 2)
  }

  get top() {
    return this.position.y - (this.position.y / 2)
  }

  get bottom() {
    return this.position.y + (this.position.y / 2)
  }

}

class Ball extends Paddles {
  constructor() {
    super(15, 15)
    this.speed = new Vector()
  }

}



window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas')
    canvas.width = 700
    canvas.height = 600

    document.body.appendChild(canvas)

  const context = canvas.getContext('2d')

  const ball = new Ball()
  ball.position.x = 0
  ball.position.y = 0
  ball.speed.x = 150
  ball.speed.y = 150

  // pong.drawBall(ball)

  let lastTime
  function callback(millis) {
    if (lastTime) {
      update(((millis - lastTime) / 1000))
    }
    lastTime = millis
    requestAnimationFrame(callback)
  }

  function update(dt) {
    ball.position.x += ball.speed.x * dt
    ball.position.y += ball.speed.y * dt

    //si sale de los limites del cambas
    if(ball.position.x < 0 || ball.position.x > (canvas.width - ball.size.x)) {
      ball.speed.x = -ball.speed.x
    }
    if(ball.position.y < 0 || ball.position.y > (canvas.height - ball.size.y)) {
      ball.speed.y = -ball.speed.y
    }

    context.fillStyle = '#000'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = '#FFF'
    context.fillRect(ball.position.x, ball.position.y, ball.size.x, ball.size.y)
  }
  callback()
})
