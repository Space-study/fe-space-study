import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface UserState {
  name: string
  email: string
  isAuthenticated: boolean
}

const initialUserState: UserState = {
  name: '',
  email: '',
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUser: (state, action: PayloadAction<{name: string; email: string}>) => {
      state.name = action.payload.name
      state.email = action.payload.email
      state.isAuthenticated = true
    },
    clearUser: state => {
      state.name = ''
      state.email = ''
      state.isAuthenticated = false
    },
    setAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
  },
})

// Export the actions
export const {setUser, clearUser, setAuthentication} = userSlice.actions

// Export the reducer
export default userSlice.reducer
