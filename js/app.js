let streetsNightTheme = document.querySelector('.streets-night')
let visitsTheme = document.querySelector('.visits')
let gyeongbokgungTheme = document.querySelector('.gyeongbokgung')
let yongmalandTheme = document.querySelector('.yongmaland')
let bukchonTheme = document.querySelector('.bukchon')

const bgMusic = document.getElementById('background-music')
const startButton = document.getElementById('start')
const muteButton = document.getElementById('muteButton')
const unmuteButton = document.getElementById('unmuteButton')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const stopButton = document.getElementById('stop')
const winnerDialog = document.querySelector('#winner')
const loserDialog = document.querySelector('#loser')

import {cardsBukchon, cardsGyeongbokgung, cardsStreetsNight, cardsVisits, cardsYongmaland} from './data.js'
import MemoryGame from './MemoryGame.js'

let pickedTheme = null
let memoryGame = null
let gameHasStarted = false
let isMuted = false
let isPaused = false
let pausedCounter = null


function toggleButtonsVisibility() {
  muteButton.style.display = isMuted ? 'none' : 'block'
  unmuteButton.style.display = isMuted ? 'block' : 'none'
}

muteButton.addEventListener('click', () => {
  isMuted = !isMuted
  bgMusic.muted = isMuted
  if (!isMuted) {
    bgMusic.play()
  }
  toggleButtonsVisibility()
})

unmuteButton.addEventListener('click', () => {
  isMuted = !isMuted;
  bgMusic.muted = isMuted;
  toggleButtonsVisibility()
})

unmuteButton.style.display = 'none'

let counter = 90 
let timerElement

startButton.addEventListener('click', () => {
  bgMusic.play()
  gameHasStarted = true
  memoryGame = new MemoryGame(pickedTheme)
  memoryGame.shuffleCards()

  counter = 90
  timerElement = document.querySelector(".timer-count")

  const timer = setInterval(function () {
    if (!isPaused) {
      counter--
      timerElement.innerHTML = counter
  
      if (counter === 0) {
        clearInterval(timer)
        loserDialog.showModal()
      }
    }
  }, 1000)


  let html = ''
  memoryGame.cards.forEach((card) => {
    html += `
      <div class="card" data-card-name="${card.name}">
        <div class="back" name="${card.img}"></div>
        <div class="front" style="background: url(img/${card.img}) no-repeat"></div>
      </div>
    `
  })

  document.getElementById('boards-game').innerHTML = html

  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => {
      if (!isPaused) {
        card.classList.add("turned")
        memoryGame.pickedCards.push(card)
  
        if (memoryGame.pickedCards.length === 2) {
          const cardOne = memoryGame.pickedCards[0]
          const cardTwo = memoryGame.pickedCards[1]
          const cardOneElement = cardOne.getAttribute('data-card-name')
          const cardTwoElement = cardTwo.getAttribute('data-card-name')
  
          if (memoryGame.checkIfPair(cardOneElement, cardTwoElement)) {
            memoryGame.pickedCards = [];
          } else {
            setTimeout(() => {
              cardOne.classList.remove('turned')
              cardTwo.classList.remove('turned')
            }, 600)
            memoryGame.pickedCards = []
          }
        }
  
        if (memoryGame.checkIfFinished()) {
          clearInterval(timer)
          winnerDialog.showModal()
        }
      } else if (memoryGame.pickedCards.length === 1) {
        setTimeout(() => {
          const flippedCard = memoryGame.pickedCards[0]
          flippedCard.classList.remove('turned')
          memoryGame.pickedCards = []
        }, 600)
      }
    })
  })
})


bukchonTheme.addEventListener('click', () => handleThemeSelection(cardsBukchon, bukchonTheme))
yongmalandTheme.addEventListener('click', () => handleThemeSelection(cardsYongmaland, yongmalandTheme))
gyeongbokgungTheme.addEventListener('click', () => handleThemeSelection(cardsGyeongbokgung, gyeongbokgungTheme))
visitsTheme.addEventListener('click', () => handleThemeSelection(cardsVisits, visitsTheme))
streetsNightTheme.addEventListener('click', () => handleThemeSelection(cardsStreetsNight, streetsNightTheme))

stopButton.addEventListener('click', () => {
  location.reload()
})

pauseButton.addEventListener('click', () => {
  isPaused = true
  pauseButton.classList.add('active')

  if (memoryGame.pickedCards.length === 1) {
    const flippedCard = memoryGame.pickedCards[0]
    flippedCard.classList.remove('turned')
    memoryGame.pickedCards = []
  }
})

playButton.addEventListener('click', () => {
  isPaused = false
  counter = pausedCounter
  pauseButton.classList.remove('active')
})


function handleThemeSelection(theme, themeElement) {
  if (gameHasStarted) return
  pickedTheme = theme
  unselectAll()
  themeElement.classList.add('selected')
}

function unselectAll(){
  let selectedElements = document.querySelectorAll('.selected')
  selectedElements.forEach(element =>  {
    element.classList.remove('selected')
  })
}


function handleCloseAndReload(dialog) {
  dialog.close()
  location.reload()
}

document.querySelector('#winner .close').addEventListener('click', () => handleCloseAndReload(winnerDialog));

document.querySelector('#loser .close').addEventListener('click', () => handleCloseAndReload(loserDialog));