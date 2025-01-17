import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface BackgroundState {
  currentBackground: string
}

const initialState: BackgroundState = {
  currentBackground: '/scene1.gif',
}

const backgroundSlice = createSlice({
  name: 'background',
  initialState,
  reducers: {
    setBackground: (state, action: PayloadAction<string>) => {
      state.currentBackground = action.payload
    },
  },
})

export const {setBackground} = backgroundSlice.actions
export default backgroundSlice.reducer
