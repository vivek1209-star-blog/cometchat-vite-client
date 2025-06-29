import type { RootState } from "../Store/store"

export const selectCurrentCall = (state: RootState) => state.call.currentCall;
