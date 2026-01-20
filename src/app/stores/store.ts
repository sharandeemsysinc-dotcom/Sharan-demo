import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from './authSlice'
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer, FLUSH, REHYDRATE,  PAUSE, PERSIST, PURGE, persistStore, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// -----------------------------
// Redux Persist Configuration
// -----------------------------
// Defines how the store data is persisted in local storage.
// The `blacklist` ensures that the RTK Query cache (api.reducerPath)
// is not persisted.
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: [api.reducerPath],
}

// -----------------------------
// Combine All Reducers
// -----------------------------
// Combines multiple slices (auth + RTK Query api reducer)
// into a single root reducer.
const reducers = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
})

// -----------------------------
// Create a Persisted Reducer
// -----------------------------
// Wraps the combined reducers with redux-persist to enable data persistence.
const persistedReducer = persistReducer(persistConfig, reducers)

// -----------------------------
// Configure the Redux Store
// -----------------------------
// Sets up the Redux store with the persisted reducer and middlewares.
// Middleware includes default Redux Toolkit middleware + RTK Query middleware.
// The serializableCheck is customized to ignore certain redux-persist actions.
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
})

// -----------------------------
// Persistor Instance
// -----------------------------
// Persistor is used to persist and rehydrate the store.
export const persistor = persistStore(store)

// -----------------------------
// Setup RTK Query Listeners
// -----------------------------
// Enables automatic refetching behaviors such as
// refetch on window focus or network reconnect.
setupListeners(store.dispatch)