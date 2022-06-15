import MenuIcon from "@components/MenuIcon";
import SlidingMenu from "@components/SlidingMenu";
import { closeMenu } from "@redux/slices/appStateSlice";
import { useAppDispatch, useAppSelector } from "@redux/store";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import MainContainerGlobalStyles from "@styles/mainContainerGlobalStyles";

const CONTACT_US_HREF = "mailto:scannahcontact@gmail.com";

const Z_INDEX_MENU = 5;

const Z_INDEX_NAVBAR_BG = 99;

const StyledMainContainer = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundMain};
`;

const NavbarSideItem = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
`;

const StyledLink = styled.a`
  border-color: ${(props) => props.theme.colors.textColor};
  border-radius: 999px;
  border-width: 3px;
  padding: 12px 24px;
  align-self: flex-end;
  transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);

  &:hover {
    background-color: ${(props) => props.theme.colors.textColor};
    color: white;
    -webkit-box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
    box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
  }
`;

interface StyledNavLinkProps {
  isActive: boolean;
}

const StyledNavLink = styled.a<StyledNavLinkProps>`
  padding: 4px;
  display: inline-block;
  position: relative;

  color: ${(props) =>
    props.isActive
      ? props.theme.colors.mainAccent
      : props.theme.colors.textColor};

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 3px;
    bottom: 4px;
    left: 0;
    background-color: ${(props) =>
      props.isActive
        ? props.theme.colors.mainAccent
        : props.theme.colors.textColor};
    transform-origin: bottom right;
    transition: transform 0.2s ease-out;
  }

  &:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

interface NavBackgroundProps {
  showBackground: boolean;
  navbarHeight: number;
}

const NavBackground = styled.div<NavBackgroundProps>`
  z-index: ${Z_INDEX_NAVBAR_BG};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${(props) => (props.showBackground ? props.navbarHeight : 0)}px;
  background-color: white;
  box-shadow: ${(props) =>
    props.showBackground ? "0px 2px 4px 0px rgba(0, 0, 0, 0.3)" : "unset"};
  -webkit-box-shadow: ${(props) =>
    props.showBackground ? "0px 2px 4px 0px rgba(0, 0, 0, 0.3)" : "unset"};
  -moz-box-shadow: ${(props) =>
    props.showBackground ? "0px 2px 4px 0px rgba(0, 0, 0, 0.3)" : "unset"};
  transition: all 0.3s ease-in-out;
`;

const HIDE_NAVBAR_BREAKPOINT = 800;

const NavLinksContainer = styled.div`
  @media (max-width: ${HIDE_NAVBAR_BREAKPOINT}px) {
    display: none;
  }
`;

const HamburgerMenu = styled.div`
  z-index: ${Z_INDEX_MENU + 1};
  display: none;
  @media (max-width: ${HIDE_NAVBAR_BREAKPOINT}px) {
    display: block;
  }
`;

export default function MainContainer({ children }) {
  const [showBackground, setShowBackground] = useState<boolean>(false);

  const navRef = useRef<HTMLDivElement>();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector((state) => state.account.isLoggedIn);

  function onScrollChange() {
    if (window) {
      setShowBackground(window.pageYOffset > 0);
    }
  }

  function getNavbarHeight(): number {
    if (navRef && navRef.current) {
      return navRef.current.clientHeight;
    }
    return 80;
  }

  function renderMenuItems() {
    return (
      <div className="flex-1 flex flex-row space-x-12 justify-center">
        <NavLinksContainer>
          <Link href="/" passHref>
            <StyledNavLink isActive={router.pathname === "/"}>
              Home
            </StyledNavLink>
          </Link>
        </NavLinksContainer>
        <NavLinksContainer>
          <Link href="/pricing" passHref>
            <StyledNavLink isActive={router.pathname.includes("/pricing")}>
              Pricing
            </StyledNavLink>
          </Link>
        </NavLinksContainer>
        <NavLinksContainer>
          <StyledNavLink isActive={false} href={CONTACT_US_HREF}>
            Contact us
          </StyledNavLink>
        </NavLinksContainer>
      </div>
    );
  }

  useEffect(() => {
    window.addEventListener("scroll", onScrollChange);

    return () => window.removeEventListener("scroll", onScrollChange);
  }, []);

  useEffect(() => {
    dispatch(closeMenu());
  }, [router.pathname]);

  const SIGN_IN_LINK_HREF = isLoggedIn ? "/dashboard" : "/sign-in";

  return (
    <StyledMainContainer className="flex-1">
      <MainContainerGlobalStyles />
      <NavBackground
        showBackground={showBackground}
        navbarHeight={getNavbarHeight()}
      />
      <nav
        ref={navRef}
        className="sticky top-0 flex flex-row px-3 md:px-8 md:px16 py-2 md:py-6 items-center justify-center poppins font-semibold text-lg"
        style={{
          zIndex: Z_INDEX_NAVBAR_BG + 10,
        }}
      >
        <NavbarSideItem>
          <Link href="/">
            <a style={{ zIndex: Z_INDEX_MENU + 1 }}>
              <img
                src="/Logo.png"
                alt="Logo"
                style={{
                  width: "64px",
                  height: "auto",
                  zIndex: Z_INDEX_MENU + 1,
                }}
              />
            </a>
          </Link>
        </NavbarSideItem>
        {renderMenuItems()}
        <NavbarSideItem>
          <NavLinksContainer>
            <Link href={SIGN_IN_LINK_HREF} passHref>
              <StyledLink>Sign in</StyledLink>
            </Link>
          </NavLinksContainer>
        </NavbarSideItem>
        <HamburgerMenu>
          <MenuIcon />
        </HamburgerMenu>
        <SlidingMenu navbarHeight={getNavbarHeight()} zIndex={Z_INDEX_MENU}>
          <div className="mt-16 flex flex-col items-center justify-center space-y-10">
            <div>
              <Link href="/">
                <a style={{ alignSelf: "initial" }}>Home</a>
              </Link>
            </div>
            <div>
              <Link href="/pricing">
                <a style={{ alignSelf: "initial" }}>Pricing</a>
              </Link>
            </div>
            <div>
              <Link href={CONTACT_US_HREF}>
                <a style={{ alignSelf: "initial" }}>Contact us</a>
              </Link>
            </div>
            <div>
              <Link href={SIGN_IN_LINK_HREF} passHref>
                <StyledLink style={{ alignSelf: "initial" }}>
                  Sign in
                </StyledLink>
              </Link>
            </div>
          </div>
        </SlidingMenu>
      </nav>
      {children}
    </StyledMainContainer>
  );
}
