function draw() {
  const canvas = document.createElement('canvas')
    canvas.width = 700
    canvas.height = 600

  const context = canvas.getContext('2d')
    context.fillStyle = '#000'
    context.fillRect(0, 0, canvas.width, canvas.height)

    document.body.appendChild(canvas)
}



window.addEventListener('DOMContentLoaded', () => {
  draw()
})
