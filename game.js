const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let x = 50
let y = 50
let r = 30
let color = "#ccc"
let vx = 1
let vy = 3
let g = 0.03
let selectedBall = null
let throwSpeedFactor = 0.3

const draw = (x, y, r, color) => {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

const update = () => {
  vy += g
  draw(x, y, r, color)

  if (y + r > canvas.height) {
    y = canvas.height - r
    vy *= -0.4
    vx *= 0.7
  }

  if (x + r > canvas.width || x - r < 0) {
    vx *= -1
  }
  if (!selectedBall) {
    x += vx
    y += vy
  }
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
    const dx = x - event.clientX - 10
    const dy = y - event.clientY + 10
    vy = -dy * throwSpeedFactor
    vx = dx * throwSpeedFactor

    console.log(dx, dy)
  }
  selectedBall = null
})
