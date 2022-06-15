import { createSlice } from "@reduxjs/toolkit";

interface IAppStateState {
  isMenuOpen: boolean;
}

const initialState: IAppStateState = {
  isMenuOpen: false,
};

const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    openMenu: (state) => {
      state.isMenuOpen = true;
    },
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
  },
});

export const { openMenu, closeMenu } = appStateSlice.actions;

export default appStateSlice.reducer;
