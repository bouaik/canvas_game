const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let x = 10
let y = 50
let r = 50
let color = "#ccc"
let vx = 1
let vy = 3
let g = 0.03
let selectedBall = null
let throwSpeedFactor = 0.03

let dragStartX
let dragStartY

let rectX = 200
let rectY = 200
let rectWidth = 300
const rectHeight = 5

let level = 1

const draw = (x, y, r, color) => {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

const drawLevel = () => {
  ctx.font = "50px serif"
  ctx.textAlign = "center"
  ctx.fillText(`Level ${level}`, canvas.width / 2, 40)
}

const update = () => {
  detectCollision()
  drawLevel()
  vy += g
  draw(x, y, r, color)

  drawTarget()

  if (y + r > canvas.height) {
    y = canvas.height - r
    vy *= -0.4
    vx *= 0.7
  }

  if (y - r < 0) {
    y = r
    vy *= -1
  }

  if (x + r > canvas.width) {
    x = canvas.width - r
    vx *= -0.9
  } else if (x - r < 0) {
    x = r
    vx *= -0.9
  }
  if (!selectedBall) {
    x += vx
    y += vy
  } else {
    drawLine()
  }
}

const drawTarget = () => {
  ctx.rect(rectX, rectY, rectWidth, rectHeight)
  ctx.fill()
}

const drawLine = () => {
  ctx.beginPath()
  ctx.moveTo(dragStartX, dragStartY)
  ctx.lineTo(x, y)
  ctx.lineWidth = 1
  ctx.stroke()
}

const animate = () => {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  update()
}
animate()

canvas.addEventListener("mousedown", function (event) {
  const distance = Math.sqrt(
    Math.pow(x - event.clientX, 2) + Math.pow(y - event.clientY, 2)
  )
  if (distance < r) {
    dragStartX = event.clientX
    dragStartY = event.clientY

    selectedBall = true
    x = event.clientX
    y = event.clientY
  }
})

canvas.addEventListener("mousemove", function (event) {
  if (selectedBall) {
    x = event.clientX
    y = event.clientY
  }
})

canvas.addEventListener("mouseup", function (event) {
  if (selectedBall) {
    const dx = dragStartX - event.clientX
    const dy = dragStartY - event.clientY
    vy = dy * throwSpeedFactor
    vx = dx * throwSpeedFactor
  }
  selectedBall = null
})

function detectCollision() {
  let closestX = Math.max(rectX, Math.min(x, rectX + rectWidth))
  let closestY = Math.max(rectY, Math.min(y, rectY + rectHeight))

  let distanceX = x - closestX
  let distanceY = y - closestY
  let distanceSquared = distanceX * distanceX + distanceY * distanceY

  if (distanceSquared < r * r) {
    const overlapX = Math.abs(closestX - x)
    const overlapY = Math.abs(closestY - y)

    if (overlapX > overlapY) {
      if (x < closestX) {
        // left
        vx *= -0.9
      } else {
        // right
        vx *= -0.9
      }
    } else {
      if (y <= closestY) {
        // top
        y = closestY - r
        vx *= 0.9
        vy *= -0.3

        if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1 && !selectedBall) {
          // ctx.font = "100px serif"
          // ctx.textAlign = "center"
          // ctx.fillStyle = "blue"
          // ctx.fillText("YOU WON!!!", canvas.width / 2, canvas.height / 2)
          level += 1
          r /= 1.5
          rectWidth /= 1.5
          x = 10
        }
      } else {
        // bottom
        vy *= -1
      }
    }
  }
}
