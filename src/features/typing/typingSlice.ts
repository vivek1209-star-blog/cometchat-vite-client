import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define the type for the slice state
interface TypingState {
  isTyping: boolean;
}

// Initial state
const initialState: TypingState = {
  isTyping: false,
};

const typingSlice = createSlice({
  name: 'typing',
  initialState,
  reducers: {
    setTyping(state: TypingState, action: PayloadAction<boolean>) {
      state.isTyping = action.payload;
    },
  },
});

export const { setTyping } = typingSlice.actions;
export default typingSlice.reducer;
