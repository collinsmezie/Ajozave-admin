import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from '../session/sessionsSlice'; 
import sessionDetailsReducer from '../session/sessionDetailsSlice';
import contributorSessionsReducer from '../session/contributorSessionSlice'; 
import ContributorSessionDetailsReducer from '../session/contributorSessionDetailsSlice';

const store = configureStore({
  reducer: {
    session: sessionReducer, // Existing slice
    sessionDetails: sessionDetailsReducer, // Add the new slice
    contributorSessions: contributorSessionsReducer,
    contributorSessionDetails: ContributorSessionDetailsReducer,

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Ensure thunk is included
});

export default store;