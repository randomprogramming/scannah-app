import Card from "@components/Card";
import Button from "@components/dashboard/Button";
import DashboardContainer from "@components/dashboard/DashboardContainer";
import { ImageUploader } from "@components/dashboard/ImageUploader";
import Icon from "@components/Icon";
import Input from "@components/Input";
import { useCustomSnackbar } from "@hooks/useCustomSnackbar";
import {
  useAccountSettings,
  useCompanySettings,
  useUpdateAccountSettings,
  useUpdateCompanySettings,
} from "@hooks/useSettings";
import { getMyQRCode } from "@redux/actions/noDispatchActions";
import { useAppSelector } from "@redux/store";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const SCREEN_NAMES = {
  qrCode: "qrCodeScreen",
  account: "accountScreen",
  company: "companyScreen",
};

interface StyledNavigatorRouteProps {
  isActive: boolean;
}

const StyledNavigatorRoute = styled.div<StyledNavigatorRouteProps>`
  background-color: ${(props) => (props.isActive ? "#fff" : "transparent")};
  font-weight: ${(props) => (props.isActive ? "500" : "initial")};
  transition: all 0.3s ease-in-out;
  padding: 2px;
  cursor: pointer;
  user-select: none;

  &:hover {
    ${(props) => !props.isActive && "background-color: #bbbbbb;"}
  }
`;

function Navigator({ activeRouteName, setNewRouteName, isBusinessAccount }) {
  function NavigatorRoute({ title, routeName, activeRouteName, onClick }) {
    return (
      <StyledNavigatorRoute
        className="flex-1 flex justify-center items-center rounded-md"
        isActive={routeName === activeRouteName}
        onClick={onClick}
      >
        {title}
      </StyledNavigatorRoute>
    );
  }

  return (
    <div className="p-1 flex flex-row justify-center items-center bg-gray-300 rounded-md shadow-inner">
      <NavigatorRoute
        title="Your QR Code"
        routeName={SCREEN_NAMES.qrCode}
        activeRouteName={activeRouteName}
        onClick={() => setNewRouteName(SCREEN_NAMES.qrCode)}
      />
      <NavigatorRoute
        title="Account"
        routeName={SCREEN_NAMES.account}
        activeRouteName={activeRouteName}
        onClick={() => setNewRouteName(SCREEN_NAMES.account)}
      />
      {isBusinessAccount && (
        <NavigatorRoute
          title="Company"
          routeName={SCREEN_NAMES.company}
          activeRouteName={activeRouteName}
          onClick={() => setNewRouteName(SCREEN_NAMES.company)}
        />
      )}
    </div>
  );
}

function QRCodeScreen() {
  const [myQRCodeSVG, setMyQRCodeSVG] = useState("");

  function renderQRCodeImage() {
    if (myQRCodeSVG.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Icon name="loading" height={40} width={40} />
        </div>
      );
    } else {
      return (
        <img
          style={{ width: "100%", height: "auto" }}
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            myQRCodeSVG.replaceAll("#ffffff", "transparent"),
          )}`}
          alt="qr code"
        />
      );
    }
  }

  useEffect(() => {
    async function fetchMyQRCode() {
      const qrCode = await getMyQRCode();
      if (qrCode && typeof qrCode === "string") {
        setMyQRCodeSVG(qrCode);
      }
    }

    if (myQRCodeSVG.length === 0) {
      fetchMyQRCode();
    }
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center mt-8">
        <Card className="inline-block w-5/6 sm:w-4/6 md:w-3/6 max-w-2xl rounded-2xl p-2">
          {renderQRCodeImage()}
        </Card>
      </div>
      <div className="w-6/6 md:w-4/6 mt-4 mx-auto text-center">
        <p className="text-secondary">
          This is your QR code. You will need to show it to the person who works
          at the shop in order to redeem your rewards and confirm your identity.
          If the shop that you’re trying to redeem the codes from doesn’t have a
          physical store, you will need to screenshot the code and send it
          digitally to the person in charge. Feel free to save this code to your
          phone so you can get rewarded even if you don't have access to mobile
          data.
        </p>
      </div>
    </div>
  );
}

function AccountScreen() {
  const { settings, isError, isLoading } = useAccountSettings();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [avatarURL, setAvatarURL] = useState("");

  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  const openCustomSnackbar = useCustomSnackbar();

  async function handleUpdatePress() {
    setIsUpdatingSettings(true);
    let data = {
      firstName,
      lastName,
      email,
      password,
      repeatedPassword,
      avatarURL,
    };

    const resp = await useUpdateAccountSettings(data);

    if (resp.isError) {
      openCustomSnackbar(resp.message, "warning");
    } else {
      openCustomSnackbar(resp.message, "success");
    }
    setPassword("");
    setRepeatedPassword("");
    setIsUpdatingSettings(false);
  }

  useEffect(() => {
    if (settings) {
      setFirstName(settings.firstName);
      setLastName(settings.lastName);
      setEmail(settings.email);
    }
  }, [settings]);

  if (isError) {
    return (
      <div className="text-center">
        Error when loading your settings. Please refresh the page.
      </div>
    );
  }

  return isLoading ? (
    <div>
      <Icon name="loading" width={24} height={24} />
    </div>
  ) : (
    <div className="flex flex-col space-y-6 mt-8 items-center">
      <ImageUploader onChange={setAvatarURL} initialUrl={settings.avatarURL} />

      <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
        <div className="flex-1">
          <div>First Name</div>
          <Input
            type="text"
            value={firstName}
            style={{ width: "100%" }}
            onChange={setFirstName}
          />
        </div>

        <div className="flex-1">
          <div>Last Name</div>
          <Input
            type="text"
            value={lastName}
            style={{ width: "100%" }}
            onChange={setLastName}
          />
        </div>
      </div>

      <div>
        <div>Email</div>
        <Input
          type="email"
          value={email}
          style={{ width: "100%" }}
          onChange={setEmail}
        />
      </div>

      <div>
        <div>Password</div>
        <Input
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Repeat New Password"
          style={{ width: "100%" }}
        />
      </div>

      <div>
        <div>Confirm Password</div>
        <Input
          type="password"
          value={repeatedPassword}
          onChange={setRepeatedPassword}
          placeholder="Repeat New Password"
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <p className="text-center text-secondary">
          You don't need to enter your password when changing your information.
        </p>
      </div>
      <div>
        <Button
          title="Update Settings"
          onClick={handleUpdatePress}
          disabled={isUpdatingSettings}
        />
      </div>
    </div>
  );
}

function CompanyScreen() {
  const { settings, isError, isLoading } = useCompanySettings();

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logoURL, setLogoURL] = useState("");

  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  const openCustomSnackbar = useCustomSnackbar();

  async function handleUpdatePress() {
    setIsUpdatingSettings(true);

    let data = {
      name,
      website,
      logoURL,
    };

    const response = await useUpdateCompanySettings(data);

    if (response.isError) {
      openCustomSnackbar(response.message, "warning");
    } else {
      openCustomSnackbar(response.message, "success");
    }

    setIsUpdatingSettings(false);
  }

  useEffect(() => {
    if (settings) {
      setName(settings.name);
      setWebsite(settings.website);
    }
  }, [settings]);

  if (isError) {
    return (
      <div className="text-center">
        There was an error retrieving your information, please try again.
      </div>
    );
  }

  return isLoading ? (
    <div>
      <Icon name="loading" width={24} height={24} />
    </div>
  ) : (
    <div className="flex flex-col space-y-6 mt-8 items-center">
      <ImageUploader
        onChange={setLogoURL}
        initialUrl={settings.logoURL}
        isBusiness
      />

      <div>
        <div>Company Name</div>
        <Input
          type="text"
          value={name}
          style={{ width: "100%" }}
          placeholder="Company"
          onChange={setName}
        />
      </div>

      <div>
        <div>Company Website</div>
        <Input
          type="text"
          value={website}
          onChange={setWebsite}
          placeholder="www.company.com"
          style={{ width: "100%" }}
        />
      </div>

      <div>
        <Button
          title="Update Settings"
          onClick={handleUpdatePress}
          disabled={isUpdatingSettings}
        />
      </div>
    </div>
  );
}

export default function Account() {
  const [activeScreen, setActiveScreen] = useState(SCREEN_NAMES.qrCode);

  const isBusinessAccount = useAppSelector(
    (state) => state.account.isBusinessAccount,
  );

  function renderScreen() {
    switch (activeScreen) {
      case SCREEN_NAMES.qrCode:
        return <QRCodeScreen />;
      case SCREEN_NAMES.account:
        return <AccountScreen />;
      case SCREEN_NAMES.company:
        return <CompanyScreen />;
    }
  }

  return (
    <DashboardContainer style={{ width: "100%" }}>
      <div className="sm:w-5/6 md:w-4/6 mx-auto">
        <Navigator
          activeRouteName={activeScreen}
          setNewRouteName={setActiveScreen}
          isBusinessAccount={isBusinessAccount}
        />
      </div>
      <div>{renderScreen()}</div>
    </DashboardContainer>
  );
}
