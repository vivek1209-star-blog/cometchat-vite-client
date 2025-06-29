import { configureStore } from '@reduxjs/toolkit';
import callReducer from "../features/callSlice";
import chatReducer from "../features/chat/chatSlice";
import typingReducer from "../features/typing/typingSlice";

export const store = configureStore({
  reducer: {
    call: callReducer,
    chat: chatReducer,
    typing: typingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
