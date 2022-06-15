import { REGISTER_URL } from "@definitions/apiEndpoints";
import { RootState } from "@redux/reducers";
import axios from "axios";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  setCreatingAccountMessage,
  setIsCreatingAccount,
  setIsErrorWhenCreatingAccount,
} from "@redux/slices/signUpScreenSlice";

export function handleRegister(
  isBusinessAccount: boolean,
  onRegisterSuccess?: () => void,
) {
  return async (
    dispatch: ThunkDispatch<RootState, void, Action>,
    getState: () => RootState,
  ) => {
    const signUpData = getState().signUpScreen;

    dispatch(setIsCreatingAccount(true));

    try {
      await axios({
        url: REGISTER_URL,
        method: "POST",
        data: {
          ...signUpData,
          isBusinessAccount,
        },
      });

      dispatch(setIsErrorWhenCreatingAccount(false));
      dispatch(
        setCreatingAccountMessage("Account created, you can now sign in."),
      );

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (err) {
      dispatch(setIsErrorWhenCreatingAccount(true));
      if (err.response) {
        dispatch(setCreatingAccountMessage(err.response.data.message));
      }
    }
    dispatch(setIsCreatingAccount(false));
  };
}
