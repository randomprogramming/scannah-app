import { combineReducers } from "redux";

import accountSlice from "@redux/slices/accountSlice";
import signInScreenSlice from "./slices/signInScreenSlice";
import campaignSlice from "./slices/campaignSlice";
import signUpScreenSlice from "./slices/signUpScreenSlice";
import appStateSlice from "./slices/appStateSlice";

const rootReducer = combineReducers({
  account: accountSlice,
  signInScreen: signInScreenSlice,
  signUpScreen: signUpScreenSlice,
  campaign: campaignSlice,
  appState: appStateSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
