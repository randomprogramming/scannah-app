import React, { useEffect } from "react";
import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import { StyledThemeProvider } from "@definitions/styled-components";
import { Provider } from "react-redux";
import GlobalStyle from "@styles/globalStyles";
import store, { useAppDispatch } from "@redux/store";
import { checkLoginStatus } from "@redux/actions/accountsActions";
import Head from "next/head";
import SnackbarProvider from "react-simple-snackbar";

function CustomComponent({ Component, pageProps }) {
  const dispatch = useAppDispatch();

  // Check if the user is logged in when a page loads
  useEffect(() => {
    dispatch(checkLoginStatus());
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Scannah</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <StyledThemeProvider>
      <Provider store={store}>
        <GlobalStyle />
        <SnackbarProvider>
          <CustomComponent Component={Component} pageProps={pageProps} />
        </SnackbarProvider>
      </Provider>
    </StyledThemeProvider>
  );
}

export default App;
