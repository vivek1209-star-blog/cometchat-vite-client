import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type CallState = {
  currentCall: CometChat.Call | null;
};

const initialState: CallState = {
  currentCall: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setCurrentCall(state, action: PayloadAction<CometChat.Call | null>) {
      state.currentCall = action.payload;
    },
  },
});

export const { setCurrentCall } = callSlice.actions;
export default callSlice.reducer;
