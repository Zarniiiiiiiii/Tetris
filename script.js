/** @format */

const grid = document.querySelector(".grid")
const miniGrid = document.querySelector(".mini-grid")
const startBtn = document.querySelector(".startBtn")
const muteBtn = document.querySelector(".muteMusic")
const unmuteBtn = document.querySelector(".unmuteMusic")
const mainMenuContainer = document.querySelector(".mainMenuContainer")
const scoreDisplay = document.querySelector("#score")
const width = 10
let isGameOver = true
let isMusicPlaying = false
let musicRandom
let musicSpeed = 1
let musicVolume = 0.3
let playMusicPlease
let nextRandom = 0
let timerId = 0
let gameClock = 1000
let score = 0
let mainMenu
let innerText
let leaderboards
let placements
let gameHasEnded
let snarkyRemark
let indexArray = []
let storedLeaderboards = []
let currentLeaderboards = []
const colors = ["#9ADCFF", "#FFF89A", "#FFBF86", "#FF8AAE", "#C1F4C5"]

const Tetrominoes = [
  [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ], //lTetromino

  [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ], //zTetromino

  [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ], //tTetromino

  [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ], //oTetromino

  [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ], //iTetromino
]

const popSound = new Audio("sounds/pop.mp3")
const gameOverSound = new Audio("sounds/gameOver.mp3")
const gameStart = new Audio("sounds/gameStart.mp3")
popSound.volume = 0.1
gameStart.volume = 0.5
gameOverSound.volume = 0.4

const musicPlaylist = [
  new Audio("music/track_1.mp3"),
  new Audio("music/track_2.mp3"),
  new Audio("music/track_3.mp3"),
  new Audio("music/track_4.mp3"),
  new Audio("music/track_5.mp3"),
  new Audio("music/track_6.mp3"),
  new Audio("music/track_7.mp3"),
  new Audio("music/track_8.mp3"),
  new Audio("music/track_9.mp3"),
  new Audio("music/track_10.mp3"),
  new Audio("music/track_11.mp3"),
  new Audio("music/track_12.mp3"),
]

const remarks = [
  "EEESH, IS THAT ALL YOU CAN DO?",
  "MAYBE YOU SHOULD TRY AN EASIER GAME?",
  `MY CODE CAN'T HANDLE SUCH INSOLENCE`,
  "I THINK YOU NEED TO TAKE A 10 MIN BREAK",
  "YOU SULLY MY CODE WITH SUCH DREADFUL PLAYS",
  "PUNY MORTAL, YOU FAIL TO AMUSE ME",
  "CRY TO YOUR MOMMY WITH SUCH PATHETIC SCORE",
  "EVEN A NOCTURAL VERMIN WITH ZERO OPPOSABLE THUMBS CAN OUTPLAY YOU",
  "WE ALL MAKE CHOICES IN LIFE, YOU`VE SEEM TO HAVE MADE ALL THE BAD ONES",
  "BELIEVING YOU ARE GOOD AT GAMES DOES NOT MEAN YOU ARE",
  "DON`T WISH FOR THE GAME TO BE EASIER, WISH THAT YOU WERE BETTER",
  "TRUST ME, JUST GIVE UP",
  "AAAAAAAAAAAAHHHRHGHHHGH, YOU`VE JUST BORED ME TO DEATH",
]

function createGrids() {
  for (i = 0; i < 200; i++) {
    const gridA = document.createElement("div")
    grid.appendChild(gridA)
  }
  for (i = 0; i < 10; i++) {
    const gridB = document.createElement("div")
    gridB.classList.add("taken")
    grid.appendChild(gridB)
  }
  for (i = 0; i < 16; i++) {
    const gridC = document.createElement("div")
    miniGrid.appendChild(gridC)
  }
}
createGrids()

let currentPosition = 4
let currentRotation = 0

let random = Math.floor(Math.random() * Tetrominoes.length)
let current = Tetrominoes[random][currentRotation]

let squares = Array.from(document.querySelectorAll(".grid div"))

function draw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.add("tetromino")
    squares[currentPosition + index].style.backgroundColor = colors[random]
  })
}

function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove("tetromino")
    squares[currentPosition + index].style.backgroundColor = ""
  })
}

function freeze() {
  if (
    current.some(index =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    current.forEach(index => squares[currentPosition + index].classList.add("taken"))
    random = nextRandom
    nextRandom = Math.floor(Math.random() * Tetrominoes.length)
    current = Tetrominoes[random][currentRotation]
    currentPosition = 4
    popSound.play()
    draw()
    displayShape()
    addScore()
    gameOver()
  }
}

function deleteTetrominos() {
  for (i = 0; i < 196; i++) {
    indexArray.push(i)
  }
  indexArray.forEach(index => {
    squares[currentPosition + index].classList.remove("tetromino")
    squares[currentPosition + index].classList.remove("taken")
    squares[currentPosition + index].style.backgroundColor = ""
  })
}

// START GAME
startBtn.addEventListener("click", startGame)

function startGame() {
  if ((isGameOver = true)) {
    removeHighScoreDisplay()
    playMusic()
    gameStart.play()
    deleteTetrominos()
    displayShape()
    isGameOver = false
    score = 0
    scoreDisplay.innerHTML = "00"
    gameClock = 1000
    startBtn.innerHTML = "START"
    timerId = setInterval(moveDown, gameClock)
    startBtn.removeEventListener("click", startGame)
  }
}
// START GAME

// difficulty & music tempo
function gameDifficulty() {
  if (score >= 1000) {
    clearInterval(timerId)
    gameClock = 100
    musicSpeed = 1.7
    musicPlaylist[musicRandom].playbackRate = musicSpeed
    timerId = setInterval(moveDown, gameClock)
  } else if (score >= 700) {
    clearInterval(timerId)
    gameClock = 150
    musicSpeed = 1.5
    musicPlaylist[musicRandom].playbackRate = musicSpeed
    timerId = setInterval(moveDown, gameClock)
  } else if (score >= 400) {
    clearInterval(timerId)
    gameClock = 200
    musicSpeed = 1.3
    musicPlaylist[musicRandom].playbackRate = musicSpeed
    timerId = setInterval(moveDown, gameClock)
  } else if (score >= 300) {
    clearInterval(timerId)
    gameClock = 250
    musicSpeed = 1.2
    musicPlaylist[musicRandom].playbackRate = musicSpeed
    timerId = setInterval(moveDown, gameClock)
  } else if (score >= 200) {
    clearInterval(timerId)
    gameClock = 300
    musicSpeed = 1.1
    musicPlaylist[musicRandom].playbackRate = musicSpeed
    timerId = setInterval(moveDown, gameClock)
  } else if (score >= 150) {
    clearInterval(timerId)
    gameClock = 400
    timerId = setInterval(moveDown, gameClock)
  } else if (score >= 90) {
    clearInterval(timerId)
    gameClock = 500
    timerId = setInterval(moveDown, gameClock)
  } else if (score >= 60) {
    clearInterval(timerId)
    gameClock = 600
    timerId = setInterval(moveDown, gameClock)
  } else if (score >= 30) {
    clearInterval(timerId)
    gameClock = 800
    timerId = setInterval(moveDown, gameClock)
  }
}
// difficulty

// controls
function controlD(e) {
  if (isGameOver == false) {
    if (e.keyCode === 37) {
      moveLeft()
    }
    if (e.keyCode === 39) {
      moveRight()
    }
    if (e.keyCode === 40) {
      moveDown()
    }
  }
}

function controlU(e) {
  if (isGameOver == false) {
    if (e.keyCode === 38) {
      rotate()
    }
  }
}

document.addEventListener("keydown", controlD)
document.addEventListener("keyup", controlU)

function moveDown() {
  undraw()
  currentPosition += width
  draw()
  freeze()
}

function moveLeft() {
  undraw()
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
  if (!isAtLeftEdge) currentPosition -= 1
  if (
    current.some(index => squares[currentPosition + index].classList.contains("taken"))
  ) {
    currentPosition += 1
  }
  draw()
}

function moveRight() {
  undraw()
  const isAtRightEdge = current.some(
    index => (currentPosition + index) % width === width - 1
  )
  if (!isAtRightEdge) currentPosition += 1
  if (
    current.some(index => squares[currentPosition + index].classList.contains("taken"))
  ) {
    currentPosition -= 1
  }
  draw()
}

function rotate() {
  undraw()
  currentRotation++
  if (currentRotation === current.length) {
    currentRotation = 0
  }
  current = Tetrominoes[random][currentRotation]
  checkRotatedPosition()
  draw()
}

function isAtRight() {
  return current.some(index => (currentPosition + index + 1) % width === 0)
}

function isAtLeft() {
  return current.some(index => (currentPosition + index) % width === 0)
}

function checkRotatedPosition(P) {
  P = P || currentPosition
  if ((P + 1) % width < 4) {
    if (isAtRight()) {
      currentPosition += 1
      checkRotatedPosition(P)
    }
  } else if (P % width > 5) {
    if (isAtLeft()) {
      currentPosition -= 1
      checkRotatedPosition(P)
    }
  }
}
//controls

// shape display
const displaySquares = document.querySelectorAll(".mini-grid div")
const displayWidth = 4
const displayIndex = 0

const upNextTetrominoes = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2],
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
  [1, displayWidth, displayWidth + 1, displayWidth + 2],
  [0, 1, displayWidth, displayWidth + 1],
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
]

function displayShape() {
  displaySquares.forEach(square => {
    square.classList.remove("tetromino")
    square.style.backgroundColor = ""
  })
  upNextTetrominoes[nextRandom].forEach(index => {
    displaySquares[displayIndex + index].classList.add("tetromino")
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
}

// shape display

//score
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

    if (row.every(index => squares[index].classList.contains("taken"))) {
      if (score >= 700) {
        score += 30
      } else if (score >= 300) {
        score += 25
      } else if (score >= 150) {
        score += 20
      } else if (score >= 90) {
        score += 20
      } else if (score >= 30) {
        score += 15
      } else if (score >= 0) {
        score += 10
      }
      gameDifficulty()
      undraw()
      scoreDisplay.innerHTML = score
      row.forEach(index => {
        squares[index].classList.remove("taken")
        squares[index].classList.remove("tetromino")
        squares[index].style.backgroundColor = ""
      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
  }
}

function highScoreDisplay() {
  let quoteGenerator = Math.floor(Math.random() * remarks.length)

  mainMenu = document.createElement("div")
  mainMenu.classList.add("mainMenu")
  mainMenu.classList.add("notmainMenu")
  mainMenuContainer.appendChild(mainMenu)

  innerText = document.createElement("div")
  innerText.innerHTML = `YOUR SCORE: ${score}`
  innerText.classList.add("menuStyle1")
  mainMenu.appendChild(innerText)

  leaderboards = document.createElement("div")
  leaderboards.innerHTML = "LEADERBOARDS:"
  leaderboards.classList.add("menuStyle2")
  mainMenu.appendChild(leaderboards)

  for (i = 0; i < 5; i++) {
    placements = document.createElement("div")
    placements.classList.add("placements")
    placements.innerHTML = `${i + 1} . . . . . . . . . ${currentLeaderboards[i]}`
    mainMenu.appendChild(placements)
  }

  gameHasEnded = document.createElement("div")
  gameHasEnded.classList.add("menuStyle3")
  gameHasEnded.innerHTML = "GAME OVER"
  mainMenu.appendChild(gameHasEnded)

  snarkyRemark = document.createElement("div")
  snarkyRemark.classList.add("menuStyle4")
  snarkyRemark.innerHTML = remarks[quoteGenerator]
  mainMenu.appendChild(snarkyRemark)
}

function removeHighScoreDisplay() {
  if (innerText != undefined) {
    mainMenu.remove()
  }
}

function scoreStorage() {
  if (localStorage.getItem("tetrisScores") === null) {
    localStorage.setItem("tetrisScores", JSON.stringify([0, 0, 0, 0, 0]))
  }
  storedLeaderboards = JSON.parse(localStorage.getItem("tetrisScores"))

  for (i = 0; i < storedLeaderboards.length; i++) {
    currentLeaderboards.push(storedLeaderboards[i])
  }

  currentLeaderboards.push(score)
  currentLeaderboards.sort(function (a, b) {
    return a - b
  })
  currentLeaderboards.reverse()

  storedLeaderboards = []

  for (i = 0; i < 5; i++) {
    storedLeaderboards.push(currentLeaderboards[i])
  }
  localStorage.clear()
  localStorage.setItem("tetrisScores", JSON.stringify(storedLeaderboards))
}
//score

//music
function playMusic() {
  if (isMusicPlaying == false) {
    musicRandom = Math.floor(Math.random() * musicPlaylist.length)
    clearInterval(playMusicPlease)
    playMusicPlease = setInterval(playMusic, 500)
    isMusicPlaying = true
    musicPlaylist[musicRandom].volume = musicVolume
    musicPlaylist[musicRandom].play()
    musicPlaylist[musicRandom].playbackRate = musicSpeed
  }
  if (musicPlaylist[musicRandom].ended == true) {
    isMusicPlaying = false
  }
}

muteBtn.addEventListener("click", muteMusic)
function muteMusic() {
  musicVolume = 0
  musicPlaylist[musicRandom].volume = musicVolume
}
unmuteBtn.addEventListener("click", unmuteMusic)
function unmuteMusic() {
  musicVolume = 0.3
  musicPlaylist[musicRandom].volume = musicVolume
}
//music

function gameOver() {
  if (
    current.some(index => squares[currentPosition + index].classList.contains("taken"))
  ) {
    isGameOver = true
    musicSpeed = 1
    musicPlaylist[musicRandom].playbackRate = musicSpeed
    startBtn.innerHTML = "AGAIN"
    gameOverSound.play()
    clearInterval(timerId)
    startBtn.addEventListener("click", startGame)
    scoreStorage()
    highScoreDisplay()
  }
}
