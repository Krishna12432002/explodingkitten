import { createSlice } from '@reduxjs/toolkit';

// Function to shuffle an array (Fisher-Yates Shuffle)
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const initialState = {
  deck: [],
  hand: [],
  message: '',
  gameOver: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      // Initialize the deck with random cards
      state.deck = shuffleArray(['😼', '🙅‍♂️', '🔀', '💣', '😼']);
      state.hand = [];
      state.message = 'Game started! Draw a card.';
      state.gameOver = false;
    },
    drawCard: (state) => {
      if (state.deck.length > 0) {
        const drawnCard = state.deck.shift();  // Remove the first card from the deck
        state.hand.push(drawnCard);

        if (drawnCard === '💣') {
          state.message = 'You drew the Exploding Kitten! Game over!';
          state.gameOver = true;
        } else if (drawnCard === '🔀') {
          state.message = 'Shuffle card drawn. Restarting the game.';
          state.deck = shuffleArray(['😼', '🙅‍♂️', '🔀', '💣', '😼']);  // Reinitialize the deck
          state.hand = [];
        } else {
          state.message = `You drew a ${drawnCard}`;
        }

        // Check if the deck is empty
        if (state.deck.length === 0 && !state.gameOver) {
          state.message = 'Congratulations! You won the game!';
          state.gameOver = true;
        }
      }
    },
    shuffleDeck: (state) => {
      state.deck = shuffleArray(state.deck);  // Shuffle the current deck
      state.message = 'Deck shuffled!';
    },
  },
});

// Export the actions and the reducer
export const { startGame, drawCard, shuffleDeck } = gameSlice.actions;
export default gameSlice.reducer;
