import React, { FormEvent, useEffect } from "react";
import { handleLogin } from "@redux/actions/signInScreenActions";
import { setEmail, setPassword } from "@redux/slices/signInScreenSlice";
import { useAppDispatch, useAppSelector } from "@redux/store";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import Input from "@components/Input";
import Icon from "@components/Icon";
import MainContainerGlobalStyles from "@styles/mainContainerGlobalStyles";

const AnimatedBackground = styled.div`
  background: linear-gradient(-45deg, #b4e7ce, #9b5094, #237978, #25283d);
  background-size: 400% 400%;
  animation: gradient 20s ease infinite;
  flex: 1;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const StyledSubmitButton = styled.input`
  background-color: ${(props) =>
    props.disabled ? "gray" : props.theme.colors.mainAccent};
  color: white;
  width: 100%;
  border-radius: 8px;
  padding: 10px 0;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  pointer-events: ${(props) => (props.disabled ? "none" : "unset")};
  -webkit-box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
    -webkit-box-shadow: 3px 3px 4px 1px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 3px 3px 4px 1px rgba(0, 0, 0, 0.2);
    box-shadow: 3px 3px 4px 1px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
  }
`;

const StyledLinkSpan = styled.span`
  color: ${(props) => props.theme.colors.mainAccent};
  font-weight: 500;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

export default function SignIn() {
  const email = useAppSelector((state) => state.signInScreen.email);
  const password = useAppSelector((state) => state.signInScreen.password);
  const isLoggedIn = useAppSelector((state) => state.account.isLoggedIn);
  const isLoggingIn = useAppSelector((state) => state.signInScreen.isLoggingIn);
  const isErrorWhenLoggingIn = useAppSelector(
    (state) => state.signInScreen.isErrorWhenLoggingIn,
  );
  const messageWhenLoggingIn = useAppSelector(
    (state) => state.signInScreen.messageWhenLoggingIn,
  );

  const dispatch = useAppDispatch();

  const router = useRouter();

  function handleLoginSuccess(loginDelay = 1000): void {
    if (router.query && router.query.redirect) {
      setTimeout(() => {
        Router.push(router.query.redirect as string);
      }, loginDelay);
    } else {
      setTimeout(() => {
        Router.push("/dashboard");
      }, loginDelay);
    }
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    dispatch(handleLogin(handleLoginSuccess));
  }

  // If user is already logged in, redirect them to the dashboard
  useEffect(() => {
    if (isLoggedIn) {
      handleLoginSuccess(0);
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    // If user is logged in, we don't want to render anything
    // We just need to wait for the browser to redirect user to dashboard
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Icon name="loading" width={32} height={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-1">
      <MainContainerGlobalStyles />
      <div
        style={{ flex: 2, maxWidth: "650px" }}
        className="flex flex-col p-4 md:p-8"
      >
        <div className="self-center">
          <Link href="/">
            <a>
              <img
                alt="Logo"
                src="/Logo.png"
                style={{
                  height: "72px",
                  width: "auto",
                }}
              />
            </a>
          </Link>
        </div>
        <div className="self-center mt-8">
          <h1>Sign in</h1>
        </div>
        <div className="mt-8">
          <form className="space-y-8" onSubmit={handleFormSubmit}>
            <div className="flex flex-col flex-1">
              <div>Email</div>
              <div className="w-full">
                <Input
                  style={{ width: "100%" }}
                  type="email"
                  placeholder="john@gmail.com"
                  value={email}
                  onChange={(newVal: string) => dispatch(setEmail(newVal))}
                  validateLength
                />
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <div>Password</div>
              <div className="w-full">
                <Input
                  style={{ width: "100%" }}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(newVal: string) => dispatch(setPassword(newVal))}
                  validateLength
                />
              </div>
            </div>
            <div className="text-center">
              {isLoggingIn ? (
                <div className="flex justify-center">
                  <Icon name="loading" height={22} width={22} />
                </div>
              ) : (
                <div>
                  <p
                    className={`${
                      isErrorWhenLoggingIn ? "text-red-600" : "text-green-500"
                    }`}
                  >
                    {messageWhenLoggingIn}
                  </p>
                </div>
              )}
            </div>
            <div className="w-full">
              <StyledSubmitButton
                type="submit"
                value="Sign in"
                disabled={isLoggingIn}
              />
            </div>
          </form>
          <div className="mt-6">
            <span>Don't have an account yet? </span>
            <Link href="/sign-up">
              <a>
                <StyledLinkSpan>Sign up here</StyledLinkSpan>
              </a>
            </Link>
            <span> or </span>
            <Link href="/sign-up/business">
              <a>
                <StyledLinkSpan>create a business account here.</StyledLinkSpan>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div style={{ flex: 4 }} className="hidden md:flex">
        <AnimatedBackground />
      </div>
    </div>
  );
}
