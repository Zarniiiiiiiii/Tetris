/** @format */

const grid = document.querySelector(".grid")
const miniGrid = document.querySelector(".mini-grid")
const startBtn = document.querySelector(".startBtn")
const muteBtn = document.querySelector(".muteMusic")
const unmuteBtn = document.querySelector(".unmuteMusic")
const mainMenuContainer = document.querySelector(".mainMenuContainer")
const scoreDisplay = document.querySelector("#score")
const devBtn = document.querySelector(".devBtn")
const addRowBtn = document.querySelector(".addRowBtn")
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

// Grid management system
const GridManager = {
  width: 10,
  height: 20,
  totalSquares: 210, // 10x20 grid + 10 bottom squares
  squares: [],
  domElements: [],

  initialize() {
    this.squares = Array(this.totalSquares).fill(null)
    this.domElements = Array(this.totalSquares).fill(null)
  },

  getRowIndices(row) {
    const start = row * this.width
    return Array.from({ length: this.width }, (_, i) => start + i)
  },

  isRowFull(row) {
    const indices = this.getRowIndices(row)
    return indices.every(index => 
      this.domElements[index]?.classList.contains('taken')
    )
  },

  clearRow(row) {
    const indices = this.getRowIndices(row)
    indices.forEach(index => {
      if (this.domElements[index]) {
        this.domElements[index].classList.remove('taken')
        this.domElements[index].classList.remove('tetromino')
        this.domElements[index].style.backgroundColor = ''
      }
    })
  },

  shiftRowsDown(fromRow) {
    for (let row = fromRow; row > 0; row--) {
      const currentIndices = this.getRowIndices(row)
      const aboveIndices = this.getRowIndices(row - 1)
      
      currentIndices.forEach((currentIndex, i) => {
        const aboveIndex = aboveIndices[i]
        if (this.domElements[aboveIndex]?.classList.contains('taken')) {
          this.domElements[currentIndex].classList.add('taken')
          this.domElements[currentIndex].style.backgroundColor = 
            this.domElements[aboveIndex].style.backgroundColor
        } else {
          this.domElements[currentIndex].classList.remove('taken')
          this.domElements[currentIndex].style.backgroundColor = ''
        }
      })
    }
    
    // Clear the top row
    this.getRowIndices(0).forEach(index => {
      this.domElements[index].classList.remove('taken')
      this.domElements[index].style.backgroundColor = ''
    })
  }
}

// Initialize grid manager
GridManager.initialize()

function createGrids() {
  for (i = 0; i < 200; i++) {
    const gridA = document.createElement("div")
    const tileNumber = document.createElement("span")
    tileNumber.classList.add("tile-number")
    tileNumber.textContent = i
    gridA.appendChild(tileNumber)
    grid.appendChild(gridA)
    GridManager.domElements[i] = gridA
  }
  for (i = 0; i < 10; i++) {
    const gridB = document.createElement("div")
    gridB.classList.add("taken")
    const tileNumber = document.createElement("span")
    tileNumber.classList.add("tile-number")
    tileNumber.textContent = 200 + i
    gridB.appendChild(tileNumber)
    grid.appendChild(gridB)
    GridManager.domElements[200 + i] = gridB
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
      GridManager.domElements[currentPosition + index + width]?.classList.contains("taken") ||
      currentPosition + index + width >= GridManager.totalSquares
    )
  ) {
    current.forEach(index => {
      if (currentPosition + index < GridManager.totalSquares) {
        GridManager.domElements[currentPosition + index].classList.add("taken")
        GridManager.domElements[currentPosition + index].style.backgroundColor = colors[random]
      }
    })
    
    random = nextRandom
    nextRandom = Math.floor(Math.random() * Tetrominoes.length)
    current = Tetrominoes[random][currentRotation]
    currentPosition = 4
    
    if (current.some(index => GridManager.domElements[currentPosition + index]?.classList.contains("taken"))) {
      gameOver()
      return
    }
    
    popSound.play()
    draw()
    displayShape()
    addScore()
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
  let rowsCleared = 0
  
  // Check each row from bottom to top
  for (let row = GridManager.height - 1; row >= 0; row--) {
    if (GridManager.isRowFull(row)) {
      // Clear the row
      GridManager.clearRow(row)
      // Shift all rows above down
      GridManager.shiftRowsDown(row)
      rowsCleared++
      // Check the same row again as it now contains new blocks
      row++
    }
  }

  // Update score based on number of rows cleared
  if (rowsCleared > 0) {
    const scoreMultiplier = Math.min(rowsCleared, 4) // Cap at 4 rows
    const baseScore = score >= 700 ? 30 :
                     score >= 300 ? 25 :
                     score >= 150 ? 20 :
                     score >= 90 ? 20 :
                     score >= 30 ? 15 : 10
    
    score += baseScore * scoreMultiplier
    scoreDisplay.innerHTML = score
    gameDifficulty()
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

// Developer mode functions
function toggleDevMode() {
  devBtn.style.display = devBtn.style.display === 'none' ? 'block' : 'none'
}

function addCompleteRow() {
  // Find the lowest row that's not completely filled
  let targetRow = -1
  for (let i = 19; i >= 0; i--) {
    const rowStart = i * width
    const row = squares.slice(rowStart, rowStart + width)
    if (!row.every(square => square.classList.contains('taken'))) {
      targetRow = i
      break
    }
  }

  if (targetRow === -1) return // All rows are full

  // Add a complete row at the target position
  const rowStart = targetRow * width
  for (let i = 0; i < width; i++) {
    const index = rowStart + i
    squares[index].classList.add('taken')
    squares[index].style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
  }

  // Check for game over
  if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
    gameOver()
  }
}

// Change keyboard shortcut to Ctrl+V
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'v') {
    toggleDevMode()
  }
})

// Add click handler for the add row button
addRowBtn.addEventListener('click', addCompleteRow)
