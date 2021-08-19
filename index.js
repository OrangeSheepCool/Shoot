const topScoreEl = document.querySelector('#topScoreEl')
const startEl = document.querySelector('#startEl')
const modalEl = document.querySelector('#modalEl')
const endScoreEl = document.querySelector('#endScoreEl')

let score = 0

let player = new Player(x, y, 10, 'white')
let projectiles = []
let enemies = []
let particles = []

function init() {
  player = new Player(x, y, 10, 'white')
  projectiles = []
  enemies = []
  particles = []
  score = 0
  topScoreEl.innerText = score
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 5) + 5
    let x
    let y
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`

    const angle = Math.atan2(
      canvas.height / 2 - y,
      canvas.width / 2 - x
    )

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }

    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

let animattionId

function animate() {
  animattionId = window.requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  })
  projectiles.forEach((projectile, index) => {
    projectile.update()

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
  })
  enemies.forEach((enemy, eIndex) => {
    enemy.update()

    const playerDist = Math.hypot(
      player.x - enemy.x,
      player.y - enemy.y
    )

    if (playerDist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animattionId)
      endScoreEl.innerText = score
      modalEl.style.visibility = 'visible'
    }

    projectiles.forEach((projectile, pIndex) => {
      const projectileDist = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      )

      if (projectileDist - enemy.radius - projectile.radius < 1) {
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 3,
              enemy.color, {
                x: (Math.random() - 0.5) * (Math.random() * 5),
                y: (Math.random() - 0.5) * (Math.random() * 5)
              }
            )
          )
        }
        if (enemy.radius - 10 > 10) {

          score += 1
          topScoreEl.innerText = score

          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          setTimeout(() => {
            projectiles.splice(pIndex, 1)
          }, 0)
        } else {

          score += 2
          topScoreEl.innerText = score

          setTimeout(() => {
            enemies.splice(eIndex, 1)
            projectiles.splice(pIndex, 1)
          }, 0)
        }
      }
    })
  })
}

window.addEventListener('click', e => {
  const angle = Math.atan2(
    e.clientY - y,
    e.clientX - x
  )
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }
  projectiles.push(
    new Projectile(x, y, 5, 'white', velocity)
  )
})

startEl.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  modalEl.style.visibility = 'hidden'
})