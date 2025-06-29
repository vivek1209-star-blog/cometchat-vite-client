import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CometChatUIKit, UIKitSettingsBuilder } from '@cometchat/chat-uikit-react';

const COMETCHAT_CONSTANTS = {
  APP_ID: import.meta.env.VITE_COMETCHAT_APP_ID,
  REGION: import.meta.env.VITE_COMETCHAT_REGION,
  AUTH_KEY: import.meta.env.VITE_COMETCHAT_AUTH_KEY,
  UID: import.meta.env.VITE_COMETCHAT_UID,
};

// Async thunk for init & login
export const initCometChat = createAsyncThunk(
  'chat/initCometChat',
  async (_, thunkAPI) => {
    try {
      const settings = new UIKitSettingsBuilder()
        .setAppId(COMETCHAT_CONSTANTS.APP_ID)
        .setRegion(COMETCHAT_CONSTANTS.REGION)
        .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
        .subscribePresenceForAllUsers()
        .build();

      await CometChatUIKit.init(settings);
      console.log('CometChat initialized');

      await CometChatUIKit.login(COMETCHAT_CONSTANTS.UID);
      console.log('User logged in');

      return true;
    } catch (error) {
      console.error('Initialization/Login failed', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

interface ChatState {
  isReady: boolean;
  error: string | null;
}

const initialState: ChatState = {
  isReady: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initCometChat.fulfilled, (state) => {
        state.isReady = true;
        state.error = null;
      })
      .addCase(initCometChat.rejected, (state, action) => {
        state.isReady = false;
        state.error = String(action.payload);
      });
  }
});

export default chatSlice.reducer;
