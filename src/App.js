import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, drawCard, shuffleDeck } from './redux/gameSlice';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const { deck, hand, message, gameOver } = useSelector((state) => state.game);
  const [username, setUsername] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [defuseAvailable, setDefuseAvailable] = useState(false);

  const handleStartGame = () => {
    if (username) {
      dispatch(startGame());  // Starts the game by initializing the deck
      setGameStarted(true);

      // Call backend API to start the game
      axios.post('/api/startGame', { username });
    }
  };

  const handleDrawCard = () => {
    if (!gameOver && deck.length > 0) {
      const drawnCard = deck[0];  // Get the top card from the deck
      dispatch(drawCard());       // Dispatch the action to remove the card from the deck

      // Implement the game rules
      if (drawnCard === '💣') {
        if (defuseAvailable) {
          setDefuseAvailable(false);
          alert('Defuse used! Bomb avoided.');
        } else {
          alert('Game Over! You drew the bomb!');
          axios.post('/api/loseGame', { username });
        }
      } else if (drawnCard === '🙅‍♂️') {
        setDefuseAvailable(true);  // Defuse card was drawn
        alert('Defuse card obtained!');
      } else if (drawnCard === '🔀') {
        dispatch(shuffleDeck());  // Shuffle the deck if shuffle card is drawn
        alert('Deck shuffled!');
      } else if (deck.length === 1) {
        // Last card drawn (no cards left to draw)
        alert('Congratulations! You win!');
        axios.post('/api/winGame', { username });  // Notify the backend of win
      }

      // Save the game state via backend
      axios.post('/api/saveGame', { username, deck, hand });
    }
  };

  return (
    <div>
      {!gameStarted ? (
        <div>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      ) : (
        <div>
          <h1>Exploding Kitten Game</h1>
          <p>{message}</p>
          <button onClick={handleDrawCard}>Draw Card</button>
          <p>Hand: {hand.join(', ')}</p>
          <p>Remaining Cards: {deck.length}</p>
          {gameOver && <p>Game Over! Try again.</p>}
        </div>
      )}
    </div>
  );
}

export default App;
