import DashboardContainer from "@components/dashboard/DashboardContainer";
import React, { useState, useEffect, useRef } from "react";
import QRCodeStyling from "StyledQRCode";
import DataEntry from "@components/DataEntry";
import Button from "@components/dashboard/Button";
import { useUpdateQrCodeSettings } from "@hooks/useSettings";
import Icon from "@components/Icon";
import { useCustomSnackbar } from "@hooks/useCustomSnackbar";
import axios from "axios";
import { QR_CODE_SETTINGS_URL } from "@definitions/apiEndpoints";
import useWindowSize from "@hooks/useWindowSize";

const QR_CODE_CONTAINER_PADDING = 2;

const DOTS_STYLE = [
  {
    key: "rounded",
    value: "Rounded",
  },
  {
    key: "dots",
    value: "Dots",
  },
  {
    key: "classy",
    value: "Classy",
  },
  {
    key: "classy-rounded",
    value: "Classy Rounded",
  },
  {
    key: "square",
    value: "Square",
  },
  {
    key: "extra-rounded",
    value: "Extra Rounded",
  },
];

const CORNER_DOTS_STYLE = [
  {
    key: "dot",
    value: "Dot",
  },
  {
    key: "square",
    value: "Square",
  },
];

const CORNER_SQUARE_STYLE = [
  {
    key: "dot",
    value: "Dot",
  },
  {
    key: "square",
    value: "Square",
  },
  {
    key: "extra-rounded",
    value: "Extra Rounded",
  },
];

const IMAGE_SIZE_STYLE = [
  {
    key: "0.2",
    value: "Small",
  },
  {
    key: "0.4",
    value: "Medium",
  },
  {
    key: "0.6",
    value: "Large",
  },
];

const IMAGE_MARGIN_STYLE = [
  {
    key: "0",
    value: "None",
  },
  {
    key: "10",
    value: "Small",
  },
  {
    key: "20",
    value: "Medium",
  },
];

function OptionSection({ children, title }) {
  return (
    <div className="mt-8">
      <div className="mb-5">
        <h3>{title}</h3>
      </div>
      <div className="space-y-3 pl-6">{children}</div>
    </div>
  );
}

export default function QRCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const qrCodeElementRef = useRef<HTMLDivElement>();

  const [code, setCode] = useState<QRCodeStyling | undefined>();
  const [codeOptions, setCodeOptions] = useState<any>({
    // These are some default values so that we don't have to check
    // if the values area loaded cuz of typescript
    // They will be overwritten as soon as useQrCodeSettings fetches the options
    margin: 0,
    dotsOptions: {
      type: "square",
      color: "#040404",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    image: "",
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 0,
    },
    cornersSquareOptions: {
      type: "square",
      color: "#040404",
    },
    cornersDotOptions: {
      type: "square",
      color: "#040404",
    },
  });
  const [companyLogoURL, setCompanyLogoURL] = useState("");
  const [isUpdatingQrCode, setIsUpdatingQrCode] = useState(false);
  const [isResettingCode, setIsResettingCode] = useState(false);

  const openCustomSnackbar = useCustomSnackbar();

  const { width } = useWindowSize();

  async function handleSaveCodeClick() {
    setIsUpdatingQrCode(true);

    const response = await useUpdateQrCodeSettings(codeOptions);

    if (response.isError) {
      openCustomSnackbar(response.message, "warning");
    } else {
      openCustomSnackbar(response.message, "success");
    }

    setIsUpdatingQrCode(false);
  }

  function fetchCodeSettings() {
    // I don't know why but if i tried fetching the data
    // in any way other this, it just didn't want to work
    setIsLoading(true);
    axios({
      url: QR_CODE_SETTINGS_URL,
      method: "GET",
    })
      .then((res) => {
        setCodeOptions(res.data.qrCodeOptions);
        setCompanyLogoURL(res.data.logoURL);
      })
      .catch((err) => {
        setIsError(true);
        console.error("Error when fetching QR Code Settings: ", err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleResetToDefaultClick() {
    setIsResettingCode(true);
    axios({
      url: QR_CODE_SETTINGS_URL,
      method: "DELETE",
    })
      .then(() => {
        openCustomSnackbar("QR Code has been reset.", "success");
        fetchCodeSettings();
      })
      .catch(() => {
        openCustomSnackbar("Failed to reset QR Code.", "warning");
      })
      .finally(() => setIsResettingCode(false));
  }

  function getCodeWidthHeightObject(clientWidth: number) {
    const width = clientWidth - QR_CODE_CONTAINER_PADDING * 2;

    return {
      width,
      height: width,
    };
  }

  useEffect(() => {
    if (qrCodeElementRef && qrCodeElementRef.current) {
      if (!code) {
        const widthHeight = getCodeWidthHeightObject(
          qrCodeElementRef.current.clientWidth,
        );

        // This is a test url, which is purposefully long, because the generated
        // QR Codes from campaigns will also be around this length
        // So the customer can make sure that their code works before actually saving it
        let url =
          process.env.NEXT_PUBLIC_PAGE_DOMAIN +
          "/code/test/0000000000000/0000000000000/0000000000000";
        // Set the code with some initial params that won't change, like the size
        setCode(
          new QRCodeStyling({
            ...widthHeight,
            data: url,
          }),
        );
      }
    }
  }, [qrCodeElementRef, qrCodeElementRef.current, code]);

  useEffect(() => {
    // Only append the code if there's not one already rendered
    if (code && qrCodeElementRef && qrCodeElementRef.current) {
      if (qrCodeElementRef.current.innerHTML.length <= 0) {
        code.append(qrCodeElementRef.current);
      }
    }
  }, [qrCodeElementRef, qrCodeElementRef.current, code]);

  useEffect(() => {
    // Whenever codeOptions change, update the code
    if (code) {
      code.update(codeOptions);
    }
  }, [codeOptions]);

  useEffect(() => {
    fetchCodeSettings();
  }, []);

  useEffect(() => {
    // Whenever the width of the screen changes, we need to update the code
    if (qrCodeElementRef && qrCodeElementRef.current) {
      const widthHeight = getCodeWidthHeightObject(
        qrCodeElementRef.current.clientWidth,
      );

      setCodeOptions({
        ...codeOptions,
        ...widthHeight,
      });
    }
  }, [width]);

  if (isLoading) {
    return (
      <DashboardContainer>
        <div className="w-full h-full flex justify-center items-center">
          <Icon name="loading" width={32} height={32} />
        </div>
      </DashboardContainer>
    );
  }

  if (isError) {
    return (
      <DashboardContainer>
        <div className="w-full h-full flex text-center justify-center items-center">
          <h3>There was an error loading your QR Code, please try again.</h3>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="flex-1">
          <h1>QR Code Options</h1>
          <OptionSection title="Main">
            <DataEntry.Dropdown
              title="Margin"
              options={[
                { key: "0", value: "None" },
                { key: "10", value: "Small" },
                { key: "30", value: "Medium" },
                { key: "50", value: "Large" },
              ]}
              onKeyChange={(newKey) =>
                setCodeOptions({ ...codeOptions, margin: parseInt(newKey) })
              }
              selectedKey={codeOptions.margin.toString()}
            />
          </OptionSection>
          <OptionSection title="Image">
            <DataEntry.Checkbox
              title="Use company logo in QR Code"
              onChange={(newVal) => {
                if (newVal) {
                  setCodeOptions({
                    ...codeOptions,
                    image: companyLogoURL,
                  });
                } else {
                  setCodeOptions({
                    ...codeOptions,
                    image: "",
                  });
                }
              }}
              initialState={codeOptions.image && codeOptions.image.length > 0}
            />
            <DataEntry.Checkbox
              title="Hide dots behind company logo"
              onChange={(newVal) => {
                const imageOptions = codeOptions.imageOptions;

                setCodeOptions({
                  ...codeOptions,
                  imageOptions: {
                    ...imageOptions,
                    hideBackgroundDots: newVal,
                  },
                });
              }}
              initialState={
                codeOptions.imageOptions &&
                codeOptions.imageOptions.hideBackgroundDots
              }
            />
            <DataEntry.Dropdown
              title="Size"
              options={IMAGE_SIZE_STYLE}
              selectedKey={codeOptions.imageOptions.imageSize.toString()}
              onKeyChange={(newKey) => {
                try {
                  const newKeyNum: number = parseFloat(newKey);
                  const imageOptions = codeOptions.imageOptions;

                  setCodeOptions({
                    ...codeOptions,
                    imageOptions: {
                      ...imageOptions,
                      imageSize: newKeyNum,
                    },
                  });
                } catch (err) {
                  // In case parseFloat fails
                }
              }}
            />
            <DataEntry.Dropdown
              title="Margin"
              options={IMAGE_MARGIN_STYLE}
              selectedKey={codeOptions.imageOptions.margin.toString()}
              onKeyChange={(newKey) => {
                try {
                  const newKeyNum: number = parseInt(newKey);
                  const imageOptions = codeOptions.imageOptions;

                  setCodeOptions({
                    ...codeOptions,
                    imageOptions: {
                      ...imageOptions,
                      margin: newKeyNum,
                    },
                  });
                } catch (err) {
                  // In case parseInt fails
                }
              }}
            />
          </OptionSection>
          <OptionSection title="Background">
            <DataEntry.ColorPicker
              title="Color"
              selectedColor={codeOptions.backgroundOptions.color}
              onChange={(newColor) =>
                setCodeOptions({
                  ...codeOptions,
                  backgroundOptions: {
                    color: newColor,
                  },
                })
              }
            />
          </OptionSection>
          <OptionSection title="Dots">
            <DataEntry.ColorPicker
              title="Color"
              selectedColor={codeOptions.dotsOptions.color}
              onChange={(newColor) => {
                const dotOptions = codeOptions.dotsOptions;

                setCodeOptions({
                  ...codeOptions,
                  dotsOptions: {
                    ...dotOptions,
                    color: newColor,
                  },
                });
              }}
            />
            <DataEntry.Dropdown
              title="Style"
              options={DOTS_STYLE}
              selectedKey={codeOptions.dotsOptions.type}
              onKeyChange={(newKey) => {
                const dotOptions = codeOptions.dotsOptions;

                setCodeOptions({
                  ...codeOptions,
                  dotsOptions: {
                    ...dotOptions,
                    type: newKey,
                  },
                });
              }}
            />
          </OptionSection>
          <OptionSection title="Corners">
            <div className="space-y-3">
              <h4>Square</h4>
              <DataEntry.ColorPicker
                title="Color"
                selectedColor={codeOptions.cornersSquareOptions.color}
                onChange={(newColor) => {
                  const cornerSquareOptions = codeOptions.cornersSquareOptions;

                  setCodeOptions({
                    ...codeOptions,
                    cornersSquareOptions: {
                      ...cornerSquareOptions,
                      color: newColor,
                    },
                  });
                }}
              />
              <DataEntry.Dropdown
                title="Style"
                options={CORNER_SQUARE_STYLE}
                selectedKey={codeOptions.cornersSquareOptions.type}
                onKeyChange={(newKey) => {
                  const cornerSquareOptions = codeOptions.cornersSquareOptions;

                  setCodeOptions({
                    ...codeOptions,
                    cornersSquareOptions: {
                      ...cornerSquareOptions,
                      type: newKey,
                    },
                  });
                }}
              />
            </div>
            <div className="space-y-3">
              <h4>Dots</h4>
              <DataEntry.ColorPicker
                title="Color"
                selectedColor={codeOptions.cornersDotOptions.color}
                onChange={(newColor) => {
                  const cornerDotOptions = codeOptions.cornersDotOptions;

                  setCodeOptions({
                    ...codeOptions,
                    cornersDotOptions: {
                      ...cornerDotOptions,
                      color: newColor,
                    },
                  });
                }}
              />
              <DataEntry.Dropdown
                title="Style"
                options={CORNER_DOTS_STYLE}
                selectedKey={codeOptions.cornersDotOptions.type}
                onKeyChange={(newKey) => {
                  const cornerDotOptions = codeOptions.cornersDotOptions;

                  setCodeOptions({
                    ...codeOptions,
                    cornersDotOptions: {
                      ...cornerDotOptions,
                      type: newKey,
                    },
                  });
                }}
              />
            </div>
          </OptionSection>
        </div>
        <div className="flex-1">
          <div className="md:sticky md:top-1/4 text-center">
            <div>
              <h1>Your QR Code</h1>
              <p className="text-secondary">
                Note that this will only affect codes exported from campaigns.
              </p>
            </div>
            <div
              ref={qrCodeElementRef}
              className="mt-4 bg-white w-11/12 mx-auto rounded-md shadow-xl"
              style={{ padding: QR_CODE_CONTAINER_PADDING }}
            ></div>
            <div className="mt-8 space-y-6">
              <div>
                <p className="text-secondary">
                  <span className="font-bold text-red-600">Warning: </span>
                  please scan your code on multiple devices before saving to
                  ensure that the code is still functional. Not having enough
                  contrast between the background and foreground colors can
                  easily break your codes.
                </p>
              </div>
              <div>
                <Button
                  title="Save Code"
                  onClick={handleSaveCodeClick}
                  disabled={isUpdatingQrCode}
                />
              </div>
              <div>
                <Button
                  title="Reset to Default"
                  onClick={handleResetToDefaultClick}
                  color="#fD0100"
                  disabled={isResettingCode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
}
