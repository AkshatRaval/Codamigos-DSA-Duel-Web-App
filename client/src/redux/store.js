import { configureStore } from '@reduxjs/toolkit'
import avatarIndexReducer from './slices/AvatarIndex'
export const store = configureStore({
  reducer: {
    avatarIndex: avatarIndexReducer,
  },
})