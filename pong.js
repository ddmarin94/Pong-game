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

    context.fillStyle = '#000'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = '#FFF'
    context.fillRect(ball.position.x, ball.position.y, ball.size.x, ball.size.y)
  }
  callback()
})
