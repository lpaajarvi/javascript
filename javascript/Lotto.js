const NUMBERS = 7
const MIN_NUMBER = 1
const MAX_NUMBER = 40

// takes the user input that is provided in parameters
let argvs = process.argv.slice(2, NUMBERS + 2)

let playerRow = []
let currentRow = []

//rows in 2digit String form [01, 03 ...] instead of Integers [1, 3 ...]
let playerRow2D = []
let currentRow2D = []

// how many games have been played so far
let gameCounter = 0

// current highscore
let highscore = 0

// all highscores in array, key-value pairs, corrects, gamesPlayed, first time 1 correct will be on key corrects: 1, gamesPlayed:
// how many games were played at the time
// if for example 2,3 and 4 will be found with the same row, only the key 4 will be saved
let highscores = []

let correctOnes = 0

let compareString = ''

let gameEnded = false

main()

function main() {
  if (validateArgvs()) {
    convertRowTo2Digits(playerRow, playerRow2D)
    playerRow2D.sort()
    for (gameCounter = 0; gameEnded === false; gameCounter++) {
      generateRow()
      compareRows()
    }
    showResults()
  } else {
    console.log(
      'Incorrect parameters, enter ' +
        NUMBERS +
        ' numbers in the range of ' +
        MIN_NUMBER +
        ' to ' +
        MAX_NUMBER
    )
  }
}

// returns true if user input is valid
//
// ( all parameters are numbers,
// numbers are between MIN_NUMBER and MAX_NUMBER and
// they are all unique )
function validateArgvs() {
  if (argvs.length < NUMBERS) {
    return false
  }
  let availableNumbers = []
  for (let i = MIN_NUMBER; i <= MAX_NUMBER; i++) {
    availableNumbers.push(i)
  }
  // validating user input
  for (let item of argvs) {
    let number = Number(item)
    if (!availableNumbers.includes(number)) {
      return false
    } else {
      playerRow.push(number)
      removeValue(number, availableNumbers)
    }
  }

  return true
}

// removes value from array, goes through whole array instead of stopping at the place where value is found
// might be good to change later, can't think right now if this feature is needed later
function removeValue(value, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      array.splice(i, 1)
      i--
    }
  }
}

function randomize(mini, maxi) {
  return Math.round(Math.random() * maxi) + mini
}

function generateRow() {
  currentRow = []
  for (let i = 0; i < NUMBERS; i++) {
    let numberOk = false
    while (!numberOk) {
      let currentNumber = randomize(MIN_NUMBER, MAX_NUMBER)
      if (!currentRow.includes(currentNumber)) {
        currentRow.push(currentNumber)
        numberOk = true
      }
    }
  }
}

// returns the number of correct numbers
function returnCorrects() {
  let correctOnes = 0
  for (let i = 0; i < playerRow.length; i++) {
    if (currentRow.includes(playerRow[i])) {
      correctOnes++
    }
  }

  return correctOnes
}

function updateHighScore(correctsThisRound) {
  //updates Highscores if neccessary
  if (correctsThisRound > highscore) {
    highscore = correctsThisRound
    console.log(
      '[' +
        playerRow2D.join(', ') +
        ']\n[' +
        currentRow2D.join(', ') +
        '] - correct = ' +
        toColor(String(correctsThisRound)) +
        '\n'
    )
    highscores.push({ corrects: correctsThisRound, gamesPlayed: gameCounter })
  }
}

function compareRows() {
  currentRow2D = []
  convertRowTo2Digits(currentRow, currentRow2D)
  currentRow2D.sort()
  let correctsThisRound = returnCorrects()
  updateHighScore(correctsThisRound)

  if (highscore === NUMBERS) {
    gameEnded = true
  }
}

// copies integers from sourceArray and puts its contents in the "2 digit" form
// in the destination array (with 05 instead of 5 etc)
function convertRowTo2Digits(sourceArray, destinationArray) {
  // destinationArray = []
  for (let i = 0; i < sourceArray.length; i++) {
    destinationArray.push(convertTo2Digits(sourceArray[i]))
  }
}

// returns given parameter number (integer) in a 2 digit String form, '1' -> '01', numbers that are >= 10
// continue to have the same form '14'(Number) -> '14'(String)
function convertTo2Digits(number) {
  if (number >= 0 && number <= 9) {
    return toColor('0' + String(number))
  } else {
    return toColor(String(number))
  }
}

function toColor(str) {
  return '\x1b[45m' + str + '\x1b[0m'
}

function weeksToYears(weeks) {
  return (weeks / 52).toFixed(2)
}

function showResults() {
  for (entry of highscores) {
    console.log(
      'You got ' +
        entry.corrects +
        ' correct, it took ' +
        weeksToYears(entry.gamesPlayed) +
        ' years!'
    )
  }
}
