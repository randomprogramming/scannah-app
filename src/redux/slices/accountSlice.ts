import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import SessionAccount from "@server/interfaces/SessionAccount";

interface IState extends SessionAccount {
  isFetchingAccount: boolean;
}

const initialState: IState = {
  isLoggedIn: false,

  isFetchingAccount: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<SessionAccount>) => {
      return { ...state, ...action.payload };
    },
    resetAccountState: (state) => {
      return initialState;
    },
    setIsFetchingAccount: (state, action: PayloadAction<boolean>) => {
      state.isFetchingAccount = action.payload;
    },
  },
});

export const { setAccount, resetAccountState, setIsFetchingAccount } =
  accountSlice.actions;

export default accountSlice.reducer;
