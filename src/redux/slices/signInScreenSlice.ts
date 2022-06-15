import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",

  isLoggingIn: false,
  isErrorWhenLoggingIn: false,
  messageWhenLoggingIn: "",
};

const signInScreenSlice = createSlice({
  name: "signInScreen",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setIsLoggingIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggingIn = action.payload;
    },
    setIsErrorWhenLoggingIn: (state, action: PayloadAction<boolean>) => {
      state.isErrorWhenLoggingIn = action.payload;
    },
    setMessageWhenLoggingIn: (state, action: PayloadAction<string>) => {
      state.messageWhenLoggingIn = action.payload;
    },
  },
});

export const {
  setEmail,
  setPassword,
  setIsLoggingIn,
  setIsErrorWhenLoggingIn,
  setMessageWhenLoggingIn,
} = signInScreenSlice.actions;

export default signInScreenSlice.reducer;
