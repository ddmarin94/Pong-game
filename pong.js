
class DrawPongField {
  constructor(canvasWidth, canvasHeight) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = canvasWidth
    this.canvas.height = canvasHeight
    this.context = this.canvas.getContext('2d')
  }

  _drawField() {
    this.context.fillStyle = '#000'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    return this
  }

  _drawBall() {
    this.context.fillStyle = '#FFF'
    this.context.fillRect(0, 0, 15, 15)
    return this
  }

  _generateCanvas() {
    document.body.appendChild(this.canvas)
    return this
  }

  init() {
    this._drawField()
      ._generateCanvas()
      ._drawBall()
  }
}



window.addEventListener('DOMContentLoaded', () => {
  const pong = new DrawPongField(700, 600)
  pong.init()
})
