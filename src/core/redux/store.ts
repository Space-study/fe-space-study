import {configureStore} from '@reduxjs/toolkit'
import blogReducer from './slices/blogSlice'
import userReducer from './slices/userSlice'

// Create the Redux store and combine the slices
export const store = configureStore({
  reducer: {
    user: userReducer,
    blog: blogReducer,
  },
})

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
