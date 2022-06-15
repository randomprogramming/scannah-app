import { useAppDispatch, useAppSelector } from "@redux/store";
import {
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  setRepeatedPassword,
  setIsErrorWhenCreatingAccount,
  setCreatingAccountMessage,
} from "@redux/slices/signUpScreenSlice";
import Link from "next/link";
import React, { FormEvent, useEffect } from "react";
import { handleRegister } from "@redux/actions/signUpScreenActions";
import styled from "styled-components";
import Card from "@components/Card";
import Input from "@components/Input";
import Icon from "@components/Icon";
import MainContainerGlobalStyles from "@styles/mainContainerGlobalStyles";

const StyledLinkSpan = styled.span`
  color: ${(props) => props.theme.colors.mainAccent};
  font-weight: 500;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
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

export default function SignUp() {
  const firstName = useAppSelector((state) => state.signUpScreen.firstName);
  const lastName = useAppSelector((state) => state.signUpScreen.lastName);
  const email = useAppSelector((state) => state.signUpScreen.email);
  const password = useAppSelector((state) => state.signUpScreen.password);
  const repeatedPassword = useAppSelector(
    (state) => state.signUpScreen.repeatedPassword,
  );
  const isCreatingAccount = useAppSelector(
    (state) => state.signUpScreen.isCreatingAccount,
  );
  const isErrorWhenCreatingAccount = useAppSelector(
    (state) => state.signUpScreen.isErrorWhenCreatingAccount,
  );
  const creatingAccountMessage = useAppSelector(
    (state) => state.signUpScreen.creatingAccountMessage,
  );

  const dispatch = useAppDispatch();

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    dispatch(handleRegister(false));
  }

  useEffect(() => {
    // Reset the error and messages when switching screens
    dispatch(setIsErrorWhenCreatingAccount(false));
    dispatch(setCreatingAccountMessage(""));
  }, []);

  // Putting inputs inside another component created issues so we have to manually
  // create all of the inputs
  return (
    <div className="flex-1 flex flex-row space-x-12">
      {/* MainContainerGlobalStyles has to be here since this component
      is not wrapped by MainDashboardContainer */}
      <MainContainerGlobalStyles />
      <div style={{ flex: 3, maxWidth: "900px" }} className="p-4 md:p-8 flex">
        <Card className="rounded-3xl p-8 flex-1">
          <div className="flex flex-row">
            <div className="flex-1">
              <h1 className="text-xl">Create a free account</h1>
              <p className="text-secondary">Start scanning codes right away!</p>
            </div>
            <div>
              <Link href="/">
                <a>
                  <img
                    alt="Logo"
                    src="/Logo.png"
                    style={{
                      height: "64px",
                      width: "auto",
                    }}
                  />
                </a>
              </Link>
            </div>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="mt-12">
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col w-full space-y-6 lg:space-y-0 lg:flex-row lg:space-x-6">
                  <div className="flex flex-col flex-1">
                    <div>First Name</div>
                    <div className="w-full">
                      <Input
                        style={{ width: "100%" }}
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(newVal: string) =>
                          dispatch(setFirstName(newVal))
                        }
                        validateLength
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div>Last Name</div>
                    <div className="w-full">
                      <Input
                        style={{ width: "100%" }}
                        type="text"
                        placeholder="Smith"
                        value={lastName}
                        onChange={(newVal: string) =>
                          dispatch(setLastName(newVal))
                        }
                        validateLength
                      />
                    </div>
                  </div>
                </div>
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
                      onChange={(newVal: string) =>
                        dispatch(setPassword(newVal))
                      }
                      validateLength
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <div>Confirm Password</div>
                  <div className="w-full">
                    <Input
                      style={{ width: "100%" }}
                      type="password"
                      placeholder="Password"
                      value={repeatedPassword}
                      onChange={(newVal: string) =>
                        dispatch(setRepeatedPassword(newVal))
                      }
                      validateLength
                    />
                  </div>
                </div>
                <div>
                  <span>Want to create a business account instead? </span>
                  <Link href="/sign-up/business">
                    <a>
                      <StyledLinkSpan>Click here.</StyledLinkSpan>
                    </a>
                  </Link>
                </div>
                <div className="text-center">
                  {isCreatingAccount ? (
                    <div className="flex justify-center">
                      <Icon name="loading" height={22} width={22} />
                    </div>
                  ) : (
                    <div>
                      <p
                        className={`${
                          isErrorWhenCreatingAccount
                            ? "text-red-600"
                            : "text-green-500"
                        }`}
                      >
                        {creatingAccountMessage}
                      </p>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <StyledSubmitButton
                    type="submit"
                    value="Create Account"
                    disabled={isCreatingAccount}
                  />
                </div>
                <div>
                  <span>Already signed up? </span>
                  <Link href="/sign-in">
                    <a>
                      <StyledLinkSpan>Sign in here.</StyledLinkSpan>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
      <div
        className="hidden md:flex items-center p-8"
        style={{
          flex: 2,
          maxWidth: "700px",
        }}
      >
        <img
          src="/RegisterProp.png"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
