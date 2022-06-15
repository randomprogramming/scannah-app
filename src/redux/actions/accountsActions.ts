import { LOGOUT_URL, ME_URL } from "@definitions/apiEndpoints";
import { RootState } from "@redux/reducers";
import {
  resetAccountState,
  setAccount,
  setIsFetchingAccount,
} from "@redux/slices/accountSlice";
import axios from "axios";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";

export function checkLoginStatus() {
  return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
    dispatch(setIsFetchingAccount(true));
    try {
      const response = await axios({
        url: ME_URL,
        method: "GET",
      });

      dispatch(setAccount(response.data));
    } catch (err) {
      dispatch(resetAccountState());

      console.error("Error when checking account: ", err);
    }
    dispatch(setIsFetchingAccount(false));
  };
}

export function destroySession(onSuccess?: () => void) {
  return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
    try {
      await axios({
        method: "POST",
        url: LOGOUT_URL,
      });

      dispatch(resetAccountState());

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error when logging out: ", err);
    }
  };
}
