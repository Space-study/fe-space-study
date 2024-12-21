import {createSlice, PayloadAction} from '@reduxjs/toolkit'

// Define initial state for blog
interface BlogState {
  posts: Array<{id: number; title: string; content: string}>
}

const initialBlogState: BlogState = {
  posts: [],
}

const blogSlice = createSlice({
  name: 'blog',
  initialState: initialBlogState,
  reducers: {
    addPost: (state, action: PayloadAction<{title: string; content: string}>) => {
      const newPost = {id: Date.now(), title: action.payload.title, content: action.payload.content}
      state.posts.push(newPost)
    },
    removePost: (state, action: PayloadAction<number>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload)
    },
  },
})

export const {addPost, removePost} = blogSlice.actions

export default blogSlice.reducer
