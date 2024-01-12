import './App.css'

import { useState, useCallback, useEffect } from 'react'
import { wordsList } from './data/words'
import Game from './components/Game'
import GameOver from './components/GameOver'
import StartScreen from './components/StartScreen'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' }
]

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)

  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(5)
  const [score, setScore] = useState(0)



  const pickedWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }, [words])


  const startGame = useCallback(() => {
    clearLettersStates()

    const { word, category } = pickedWordAndCategory()

    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)


    setGameStage(stages[1].name)
  }, [pickedWordAndCategory])

  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()

    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
      
    }
  }

  const clearLettersStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if (guesses <= 0) {
      clearLettersStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() =>{

    const uniqueLetters = [... new Set(letters)]

    if (guessedLetters.length === uniqueLetters.length) {
      setScore((acttualScore) => acttualScore +=100)

      startGame()
    }

  }, [guessedLetters, letters, startGame]) 



  const retry = () => {

    setScore(0)
    setGuesses(5)

    setGameStage(stages[0].name)
  }


  return (
    <>
      <main className='App'>
        {gameStage === 'start' && <StartScreen startGame={startGame} />}
        {gameStage === 'game' && (
          <Game
            verifyLetter={verifyLetter}
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
          />
        )}
        {gameStage === 'end' && <GameOver retry={retry} score={score} />}
      </main>
    </>
  )
}

export default App
