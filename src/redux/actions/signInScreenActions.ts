import { LOGIN_URL } from "@definitions/apiEndpoints";
import { RootState } from "@redux/reducers";
import {
  setIsErrorWhenLoggingIn,
  setIsLoggingIn,
  setMessageWhenLoggingIn,
} from "@redux/slices/signInScreenSlice";
import axios from "axios";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { checkLoginStatus } from "./accountsActions";

export function handleLogin(onLoginSuccess?: () => void) {
  return async (
    dispatch: ThunkDispatch<RootState, void, Action>,
    getState: () => RootState,
  ) => {
    const email: string = getState().signInScreen.email;
    const password: string = getState().signInScreen.password;

    dispatch(setIsLoggingIn(true));

    try {
      const response = await axios({
        url: LOGIN_URL,
        method: "POST",
        data: {
          email,
          password,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        dispatch(checkLoginStatus());

        dispatch(setIsErrorWhenLoggingIn(false));
        dispatch(
          setMessageWhenLoggingIn(
            "Login successful, you will be redirected shortly.",
          ),
        );

        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (err) {
      dispatch(setIsErrorWhenLoggingIn(true));
      dispatch(setMessageWhenLoggingIn(err.response.data.message));
    }

    dispatch(setIsLoggingIn(false));
  };
}
