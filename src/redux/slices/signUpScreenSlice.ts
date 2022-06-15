import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  repeatedPassword: "",

  companyName: "",
  companyWebsite: "",
  isCreatingAccount: false,
  isErrorWhenCreatingAccount: false,
  creatingAccountMessage: "",
};

const signUpScreenSlice = createSlice({
  name: "signUpScreen",
  initialState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setRepeatedPassword: (state, action: PayloadAction<string>) => {
      state.repeatedPassword = action.payload;
    },
    setCompanyName: (state, action: PayloadAction<string>) => {
      state.companyName = action.payload;
    },
    setCompanyWebsite: (state, action: PayloadAction<string>) => {
      state.companyWebsite = action.payload;
    },
    setIsCreatingAccount: (state, action: PayloadAction<boolean>) => {
      state.isCreatingAccount = action.payload;
    },
    setIsErrorWhenCreatingAccount: (state, action: PayloadAction<boolean>) => {
      state.isErrorWhenCreatingAccount = action.payload;
    },
    setCreatingAccountMessage: (state, action: PayloadAction<string>) => {
      state.creatingAccountMessage = action.payload;
    },
  },
});

export const {
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  setRepeatedPassword,
  setCompanyName,
  setCompanyWebsite,
  setIsCreatingAccount,
  setIsErrorWhenCreatingAccount,
  setCreatingAccountMessage,
} = signUpScreenSlice.actions;

export default signUpScreenSlice.reducer;
