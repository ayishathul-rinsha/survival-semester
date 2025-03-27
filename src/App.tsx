import React, { useState, useEffect } from 'react';
import { AlertCircle, Trophy, RefreshCw } from 'lucide-react';
import { VALID_WORDS, TARGET_WORDS } from './data/words';

function App() {
  const [word, setWord] = useState('');
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(500);
  const [attempts, setAttempts] = useState(0);
  const [beforeWords, setBeforeWords] = useState<string[]>([]);
  const [afterWords, setAfterWords] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * TARGET_WORDS.length);
    setWord(TARGET_WORDS[randomIndex]);
    setGuess('');
    setMessage('');
    setScore(500);
    setAttempts(0);
    setBeforeWords([]);
    setAfterWords([]);
    setGameOver(false);
  };

  const handleGuess = () => {
    const upperGuess = guess.toUpperCase();

     if (score <= 0) {
      setMessage('GAME OVER - OUT OF POINTS!');
      setGameOver(true);
    }
    
    if (!VALID_WORDS.includes(upperGuess)) {
      setMessage('Not a valid word!');
      setGuess('');
      setScore(Math.max(0, score - 50));
      setAttempts(attempts + 1);
      return;
    }

    if (upperGuess === word) {
      setMessage(`CORRECT! +${score} points`);
      setGameOver(true);
      return;
    }

    setScore(Math.max(0, score - 50));
    setAttempts(attempts + 1);

    if (upperGuess < word) {
      setBeforeWords([...beforeWords, upperGuess].sort());
    } else {
      setAfterWords([...afterWords, upperGuess].sort());
    }
    
    setGuess('');
  };

  return (
    <div className="relative min-h-screen p-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold game-text mb-2">SURVIVAL SEMESTER</h1>
          <div className="w-3/4 h-1 bg-[rgb(94,129,162)] mx-auto mb-4" />
          <p className="text-gray-600">What are some struggles you face in your student life? Take a guess</p>
        </div>

        {/* Score Panel */}
        <div className="panel p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={32} />
            <span className="text-3xl font-bold score-text">{score}</span>
          </div>
          <div className="game-text text-lg">
            Attempts: {attempts}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`panel mb-6 p-4 flex items-center justify-center ${
            message.includes('CORRECT') ? 'bg-[rgb(100,221,123)]' : 'bg-[rgb(255,105,97)]'
          }`}>
            <AlertCircle className="mr-2" size={24} />
            <span className="text-xl font-bold">{message}</span>
          </div>
        )}

        {/* Game Area */}
        <div className="space-y-4">
          {beforeWords.length > 0 && (
            <div className="panel p-4">
              <p className="game-text text-lg">Higher than: {beforeWords[beforeWords.length - 1]}</p>
            </div>
          )}

          {!gameOver && (
            <div className="flex gap-4">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                className="flex-1 p-4 text-2xl text-center panel border-0 focus:ring-2 focus:ring-[rgb(94,129,162)] focus:outline-none"
                placeholder="TYPE YOUR GUESS"
              />
              <button
                onClick={handleGuess}
                className="btn-game px-8 py-4 text-white rounded-lg font-bold text-lg shadow-lg"
              >
                Guess
              </button>
            </div>
          )}

          {afterWords.length > 0 && (
            <div className="panel p-4">
              <p className="game-text text-lg">Lower than: {afterWords[0]}</p>
            </div>
          )}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="fixed inset-0 game-over-overlay flex items-center justify-center">
            <div className="panel bg-white p-8 text-center max-w-lg mx-4">
              <h2 className="text-4xl font-bold mb-4 game-text">
                {score > 0 ? 'VICTORY!' : 'GAME OVER'}
              </h2>
              <p className="text-xl mb-6">
                {score > 0 
                  ? `Solved with ${score} points remaining!` 
                  : 'You ran out of points!'}
              </p>
              <button
                onClick={startNewGame}
                className="btn-game flex items-center justify-center gap-2 mx-auto px-8 py-4 text-white rounded-lg font-bold text-xl"
              >
                <RefreshCw size={24} />
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;