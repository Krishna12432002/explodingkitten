import { combineReducers } from 'redux';
import gameReducer from './gameSlice'; // Ensure this path is correct

const rootReducer = combineReducers({
  game: gameReducer, // This will hold your game-related state
  // You can add other reducers here if you have them
});

export default rootReducer;
