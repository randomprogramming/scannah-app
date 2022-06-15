import Icon, { IconProps } from "@components/Icon";
import MenuIcon from "@components/MenuIcon";
import SlidingMenu from "@components/SlidingMenu";
import { closeMenu } from "@redux/slices/appStateSlice";
import { useAppDispatch, useAppSelector } from "@redux/store";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import styled, { CSSProperties } from "styled-components";
import DashboardContainerGlobalStyles from "@styles/dashboardContainerGlobalStyles";
import {
  checkLoginStatus,
  destroySession,
} from "@redux/actions/accountsActions";

const NAVBAR_SIZE = 111;
const ICON_SIZE = NAVBAR_SIZE / 4.5;
const pathNames = {
  home: "/dashboard",
  campaigns: "/dashboard/campaigns",
  account: "/dashboard/account",
  qrCode: "/dashboard/qrcode",
};
const activePathColor = "white";
const NAVBAR_BREAKPOINT = 1000;
const Z_INDEX_MENU = 5;

const MainDashboardContainer = styled.div`
  padding-top: ${NAVBAR_SIZE}px;
  padding-left: ${NAVBAR_SIZE}px;
  background-color: ${(props) => props.theme.colors.backgroundDashboard};
  flex: 1;
  display: flex;

  @media screen and (max-width: ${NAVBAR_BREAKPOINT}px) {
    padding-left: 0px;
  }
`;

const Navbar = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${NAVBAR_SIZE}px;
  height: unset;

  @media screen and (max-width: ${NAVBAR_BREAKPOINT}px) {
    right: 0;
    bottom: unset;
    flex-direction: row;
    width: unset;
    height: ${NAVBAR_SIZE}px;
  }
`;

const LogoContainer = styled.div`
  width: ${NAVBAR_SIZE}px;
  height: ${NAVBAR_SIZE}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavbarIcons = styled.div`
  @media screen and (max-width: ${NAVBAR_BREAKPOINT}px) {
    display: none;
  }
`;

interface IconContainerProps {
  isActivePath: boolean;
}

const IconContainer = styled.div<IconContainerProps>`
  background-color: ${(props) =>
    props.isActivePath ? props.theme.colors.textColor : "transparent"};
  -webkit-box-shadow: ${(props) =>
    props.isActivePath ? "2px 2px 4px 0px rgba(0,0,0,0.3);" : "none;"};
  -moz-box-shadow: ${(props) =>
    props.isActivePath ? "2px 2px 4px 0px rgba(0,0,0,0.3);" : "none;"};
  box-shadow: ${(props) =>
    props.isActivePath ? "2px 2px 4px 0px rgba(0,0,0,0.3);" : "none;"};

  padding: 16px;
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: row;

  color: ${(props) =>
    props.isActivePath ? "#D1D5DB" : props.theme.colors.textColor};

  &:hover {
    background-color: ${(props) =>
      props.isActivePath ? props.theme.colors.textColor : "#D1D5DB"};
  }
`;

const MobileNavbarPathNames = styled.div`
  display: none;
  margin-left: 16px;
  font-weight: 600;

  @media screen and (max-width: ${NAVBAR_BREAKPOINT}px) {
    display: block;
  }
`;

const MenuIconContainer = styled.div`
  @media screen and (min-width: ${NAVBAR_BREAKPOINT}px) {
    display: none;
  }
`;

interface LinkContainerProps {
  href: string;
  isActivePath: boolean;
  color: string;
  iconName: IconProps["name"];
  pathName: string;
}

function LinkContainer({
  href,
  isActivePath,
  color,
  iconName,
  pathName,
}: LinkContainerProps) {
  return (
    <div>
      <Link href={href}>
        <a>
          <IconContainer isActivePath={isActivePath}>
            <Icon
              name={iconName}
              color={color}
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
            <MobileNavbarPathNames>{pathName}</MobileNavbarPathNames>
          </IconContainer>
        </a>
      </Link>
    </div>
  );
}

export default function DashboardContainer({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  const router = useRouter();

  const isFetchingAccount = useAppSelector(
    (state) => state.account.isFetchingAccount,
  );

  const isLoggedIn = useAppSelector((state) => state.account.isLoggedIn);

  const isBusinessAccount = useAppSelector(
    (state) => state.account.isBusinessAccount,
  );

  const dispatch = useAppDispatch();

  const onLogoutSuccess = () => {
    router.push("/");
  };

  const handleLogoutPress = () => {
    dispatch(destroySession(onLogoutSuccess));
  };

  useEffect(() => {
    dispatch(closeMenu());
  }, [router.pathname]);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, []);

  if (isFetchingAccount) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <Icon name="loading" width={32} height={32} />
      </div>
    );
  }

  function renderMenu() {
    return (
      <div className="flex flex-col space-y-12">
        <LinkContainer
          href={pathNames.home}
          color={
            router.pathname === pathNames.home ? activePathColor : "#6B7280"
          }
          iconName="home"
          isActivePath={router.pathname === pathNames.home}
          pathName="Dashboard"
        />
        {isBusinessAccount && (
          <LinkContainer
            href={pathNames.campaigns}
            color={
              router.pathname.includes(pathNames.campaigns)
                ? activePathColor
                : "#6B7280"
            }
            iconName="campaigns"
            isActivePath={router.pathname.includes(pathNames.campaigns)}
            pathName="Campaigns"
          />
        )}
        <LinkContainer
          href={pathNames.account}
          color={
            router.pathname.includes(pathNames.account)
              ? activePathColor
              : "#6B7280"
          }
          iconName="account"
          isActivePath={router.pathname === pathNames.account}
          pathName="Account"
        />
        {isBusinessAccount && (
          <LinkContainer
            href={pathNames.qrCode}
            color={
              router.pathname === pathNames.qrCode ? activePathColor : "#6B7280"
            }
            iconName="qrcode"
            isActivePath={router.pathname === pathNames.qrCode}
            pathName="QR Code"
          />
        )}
        <div>
          <div onClick={handleLogoutPress} style={{ cursor: "pointer" }}>
            <IconContainer isActivePath={false}>
              <Icon
                name="logout"
                color="#FD0100"
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
              <MobileNavbarPathNames style={{ color: "#FD0100" }}>
                Log Out
              </MobileNavbarPathNames>
            </IconContainer>
          </div>
        </div>
      </div>
    );
  }

  return !isFetchingAccount && isLoggedIn ? (
    <MainDashboardContainer>
      <SlidingMenu zIndex={Z_INDEX_MENU} navbarHeight={NAVBAR_SIZE}>
        {renderMenu()}
      </SlidingMenu>
      <DashboardContainerGlobalStyles />
      <Navbar style={{ zIndex: Z_INDEX_MENU + 1 }}>
        <LogoContainer>
          <Link href="/dashboard">
            <a className="inline-flex justify-center">
              <img
                src="/Logo.png"
                alt="Logo"
                style={{ width: "64%", height: "auto", maxHeight: "72px" }}
              />
            </a>
          </Link>
        </LogoContainer>
        <MenuIconContainer className="ml-auto">
          <MenuIcon />
        </MenuIconContainer>
        <NavbarIcons className="flex flex-col space-y-12 mt-36">
          {renderMenu()}
        </NavbarIcons>
      </Navbar>
      <div className="px-3 md:px-8 pb-8 lg:container mx-auto" style={style}>
        {children}
      </div>
    </MainDashboardContainer>
  ) : (
    <div className="text-center mt-16">
      <h3>
        Please log in{" "}
        <Link href="/sign-in">
          <a className="text-green-600">here</a>
        </Link>{" "}
        to access this page.
      </h3>
    </div>
  );
}
