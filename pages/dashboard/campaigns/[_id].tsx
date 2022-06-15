import React, { useState } from "react";
import { useRouter } from "next/router";
import { useCampaign } from "src/hooks/useCampaigns";
import DashboardContainer from "@components/dashboard/DashboardContainer";
import Card from "@components/Card";
import Button from "@components/dashboard/Button";
import AnimatedNumber from "react-animated-number";
import styled from "styled-components";
import Icon from "@components/Icon";
import {
  deactivateCampaign,
  exportCodes,
  generateCodes,
  drawGiveawayWinners,
} from "@redux/actions/noDispatchActions";
import Input from "@components/Input";
import useCampaignScans from "src/hooks/useCampaignScans";
import { CampaignTypeInterface } from "@server/models/CampaignType";
import { CAMPAIGN_TYPES_ENUM } from "@server/constants";
import {
  GiveawayCampaignProps,
  LuckyTicketCampaignProps,
  PointCollectorCampaignProps,
} from "@server/models/CampaignProps";
import { DownloadLinkBaseInterface } from "@server/models/DownloadLink";
import { useCustomSnackbar } from "@hooks/useCustomSnackbar";
import DataEntry from "@components/DataEntry";

interface TextContainerProps {
  number: number;
  text: string;
}

const StyledDownloadLink = styled.a`
  background-color: #f57f51;
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    opacity: 0.7;
  }
`;

const TextContainer = ({ number, text }: TextContainerProps) => {
  return (
    <div className="flex flex-col p-8 text-center" style={{ width: "222px" }}>
      <div>
        <AnimatedNumber
          component="h1"
          value={number}
          stepPrecision={0}
          duration={500}
        />
      </div>
      <div>
        <h4>{text}</h4>
      </div>
    </div>
  );
};

interface DropdownContainerProps {
  isShowing: boolean;
}

const DropdownContainer = styled.div<DropdownContainerProps>`
  position: absolute;
  scale: ${(props) => (props.isShowing ? "1" : "0")};
  visibility: ${(props) => (props.isShowing ? "visible" : "hidden")};
  transition: all 0.3s cubic-bezier(0, 1, 0.5, 1);
  margin-top: 8px;
  width: 100%;
`;

const Campaign = () => {
  const router = useRouter();
  const { _id } = router.query;

  const { campaign, isLoading, isError } = useCampaign(_id as string);
  const {
    campaignScans,
    isLoading: isCampaignScansLoading,
    isError: isCampaignScansError,
  } = useCampaignScans(_id as string);

  const [amountToGenerate, setAmountToGenerate] = useState("");
  const [amountOfWinningCodesToGenerate, setAmountOfWinningCodesToGenerate] =
    useState("");
  const [amountOfCodePointRewards, setAmountOfCodePointRewards] = useState("");
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const [showInformationDropdown, setShowInformationDropdown] = useState(false);
  const [showCampaignActiveSettings, setShowCampaignActiveSettings] =
    useState(false);
  const [showDrawWinnersMenu, setShowDrawWinnersMenu] = useState(false);
  const [amountOfWinnersEntry, setAmountOfWinnersEntry] = useState("");
  const [deactivateCampaignAfterDraw, setDeactivateCampaignAfterDraw] =
    useState(false);

  const openSnackbar = useCustomSnackbar();

  async function handleGenerateCodesClick() {
    openSnackbar("Your codes will be generated shortly.", "alert");
    if (
      !(await generateCodes(
        amountToGenerate,
        _id as string,
        amountOfWinningCodesToGenerate,
        amountOfCodePointRewards,
      ))
    ) {
      openSnackbar(
        "There was an error generating codes, try again.",
        "warning",
      );
    }
  }

  function handleExportClick() {
    openSnackbar(
      "Code export requested, please check back in a few minutes.",
      "alert",
    );
    exportCodes(_id as string);
    // Set it manually for now so that user knows that
    // export has started
    campaign.isExportingCodes = true;
  }

  if (isError) {
    return (
      <DashboardContainer>
        <div className="flex-1 text-center">
          <h2>There was an error loading this campaign.</h2>
        </div>
      </DashboardContainer>
    );
  }

  function renderDownloadButton() {
    const downloadLink = campaign.downloadLink as DownloadLinkBaseInterface;

    if (campaign.isExportingCodes) {
      return (
        <div className="flex flex-row justify-center py-4 space-x-4">
          <div>
            <p className="font-bold">Codes are being exported...</p>
          </div>
          <div>
            <Icon name="loading" width={24} height={24} />
          </div>
        </div>
      );
    }

    return (
      campaign.downloadLink &&
      downloadLink.link.length > 0 && (
        <div className="inline-flex flex-row items-center self-center lg:self-end relative">
          <div className="relative flex-1 flex">
            <div
              style={{ minWidth: "80px" }}
              className="cursor-pointer p-2"
              onClick={() => {
                setShowInformationDropdown(!showInformationDropdown);
              }}
            >
              <Icon name="information" width={28} height={28} />
            </div>
            {showInformationDropdown && (
              <Card
                className="absolute rounded-md p-4 left-0 mt-12"
                style={{ zIndex: 1 }}
              >
                <p>
                  <span
                    style={{
                      color: "#dd1d1d",
                      fontWeight: 600,
                    }}
                  >
                    Warning:{" "}
                  </span>
                  Exported codes are deleted from the server after 14 days.
                </p>
              </Card>
            )}
          </div>
          <div>
            <Button color="transparent">
              <StyledDownloadLink
                target="_blank"
                href={downloadLink.link}
                className="px-11 py-4 rounded-full"
              >
                Download Codes
              </StyledDownloadLink>
            </Button>
          </div>
        </div>
      )
    );
  }

  function processDate(date: Date): string {
    const jsDate = new Date(date);

    return `${jsDate.toLocaleDateString("en", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} - ${jsDate.toLocaleTimeString("en", {
      hour: "numeric",
      minute: "numeric",
    })}`;
  }

  function renderScans() {
    if (isCampaignScansError || !campaignScans) {
      console.error("Error when loading scans: ", isCampaignScansError);
      return;
    }
    return campaignScans.map((scan) => (
      <tr key={scan.scannedBy + " " + scan.dateScanned}>
        <td>{scan.scannedBy}</td>
        <td>{processDate(scan.dateScanned)}</td>
      </tr>
    ));
  }

  function renderGenerateWinningCodes() {
    const campaignType = campaign.campaignType as CampaignTypeInterface;
    if (campaignType.title === CAMPAIGN_TYPES_ENUM.luckyTicket) {
      return (
        <>
          <div className="mt-4">
            <p className="text-secondary text-sm">Winning Codes:</p>
          </div>
          <div>
            <Input
              type="text"
              value={amountOfWinningCodesToGenerate}
              onChange={setAmountOfWinningCodesToGenerate}
              placeholder="5"
            />
          </div>
        </>
      );
    }
  }

  function renderPointsInputCodes() {
    const campaignType = campaign.campaignType as CampaignTypeInterface;
    if (campaignType.title === CAMPAIGN_TYPES_ENUM.pointCollector) {
      return (
        <>
          <div className="mt-4">
            <p className="text-secondary text-sm">Codes Point Reward:</p>
          </div>
          <div>
            <Input
              type="text"
              value={amountOfCodePointRewards}
              onChange={setAmountOfCodePointRewards}
              placeholder="50"
            />
          </div>
        </>
      );
    }
  }

  function renderCardStats() {
    // Push all the custom cards that we want to render into this array
    let renderable = [];

    const campaignType = campaign.campaignType as CampaignTypeInterface;

    if (campaignType.title === CAMPAIGN_TYPES_ENUM.luckyTicket) {
      if (campaign.campaignProps.length === 0) {
        return;
      }
      const campaignProps = campaign
        .campaignProps[0] as LuckyTicketCampaignProps;

      renderable.push(
        <TextContainer
          key="active winning tickets"
          number={campaignProps.amountOfActiveWinningTickets}
          text="active winning tickets"
        />,
      );
      renderable.push(
        <TextContainer
          key="scanned winning tickets"
          number={campaignProps.amountOfScannedWinningTickets}
          text="scanned winning tickets"
        />,
      );
    }

    if (campaignType.title === CAMPAIGN_TYPES_ENUM.giveaway) {
      renderable.push(
        <TextContainer
          key="number of winning entries"
          number={campaign.winningEntriesCount}
          text="number of winning entries"
        />,
      );
      renderable.push(
        <TextContainer
          key="number of redeemed entries"
          number={campaign.redeemedEntriesCount}
          text="number of redeemed entries"
        />,
      );
    }

    return renderable;
  }

  function handleDeactivateCampaignClick() {
    deactivateCampaign(campaign._id as unknown as string);
    setShowCampaignActiveSettings(false);
  }

  function handleDrawWinnersClick() {
    setShowDrawWinnersMenu(!showDrawWinnersMenu);
  }

  async function handleDrawWinners() {
    try {
      await drawGiveawayWinners(
        campaign._id as unknown as string,
        amountOfWinnersEntry,
        deactivateCampaignAfterDraw,
      );
      openSnackbar("Winners have been drawn.", "success");
      if (deactivateCampaignAfterDraw) {
        campaign.isActive = false;
      }
    } catch (err) {
      openSnackbar(err.response.data.message, "warning");
    }
  }

  function ScanTable() {
    return (
      <Card className="rounded-xl p-4">
        <table className="table-fixed">
          <thead>
            <tr>
              <th className="w-1/4 text-left">Scanned By</th>
              <th className="w-1/4 text-left">Scanned Date</th>
            </tr>
          </thead>
          <tbody>{renderScans()}</tbody>
        </table>
      </Card>
    );
  }

  function renderCampaignIsActiveSpan() {
    return campaign.isActive ? (
      <span
        className="font-bold text-green-500 cursor-pointer select-none"
        onClick={() =>
          setShowCampaignActiveSettings(!showCampaignActiveSettings)
        }
      >
        active
      </span>
    ) : (
      <span className="font-bold text-red-500">not active</span>
    );
  }

  function renderCampaignParticipants() {
    const campaignType = campaign.campaignType as CampaignTypeInterface;

    if (campaignType.title === CAMPAIGN_TYPES_ENUM.giveaway) {
      const campaignProps = campaign.campaignProps as GiveawayCampaignProps[];
      campaignProps.sort((a, b) => {
        if (a.giveawayEntries > b.giveawayEntries) {
          return -1;
        } else if (a.giveawayEntries < b.giveawayEntries) {
          return 1;
        } else {
          return 0;
        }
      });

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ScanTable />
          <Card className="rounded-xl p-4">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th className="w-1/4 text-left">Participant Name</th>
                  <th className="w-1/4 text-left">Giveaway Entries</th>
                </tr>
              </thead>
              <tbody>
                {campaignProps.map((props) => {
                  const account = props.account as any;
                  return (
                    <tr key={props.id}>
                      <td>{account.firstName}</td>
                      <td>{props.giveawayEntries}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      );
    } else if (campaignType.title === CAMPAIGN_TYPES_ENUM.pointCollector) {
      const campaignProps =
        campaign.campaignProps as PointCollectorCampaignProps[];

      campaignProps.sort((a, b) => {
        if (a.collectedPoints > b.collectedPoints) {
          return -1;
        } else if (a.collectedPoints < b.collectedPoints) {
          return 1;
        } else {
          return 0;
        }
      });

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ScanTable />
          <Card className="rounded-xl p-4">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th className="w-1/4 text-left">Participant Name</th>
                  <th className="w-1/4 text-left">Points Collected</th>
                </tr>
              </thead>
              <tbody>
                {campaignProps.map((props) => {
                  const account = props.account as any;
                  return (
                    <tr key={props.id}>
                      <td>{account.firstName}</td>
                      <td>{props.collectedPoints}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      );
    } else {
      return <ScanTable />;
    }
  }

  return (
    <DashboardContainer>
      {isLoading ? (
        <Icon name="loading" height={48} width={48} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              <div>
                <h1 className="break-words">{campaign.name}</h1>
              </div>
              <div>
                <p className="mt-2 ml-1">
                  Campaign is {renderCampaignIsActiveSpan()}
                </p>
              </div>
              <div
                style={{
                  visibility: showCampaignActiveSettings ? "visible" : "hidden",
                }}
              >
                <p className="mt-2 ml-1 font-bold">
                  This will deactivate the campaign.
                </p>
                <p
                  className="ml-1 text-red-500 font-bold select-none cursor-pointer"
                  onClick={handleDeactivateCampaignClick}
                >
                  Click here to confirm your action.
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              {renderDownloadButton()}
              <div className="flex flex-row space-x-4 self-center relative">
                <div>
                  <Button
                    disabled={campaign.totalNumberOfCodes === 0}
                    title="Export Codes"
                    onClick={handleExportClick}
                  />
                </div>
                <div className="relative">
                  <Button
                    title="Generate Codes"
                    disabled={!campaign.isActive}
                    onClick={() =>
                      setShowGenerateDropdown(!showGenerateDropdown)
                    }
                  />
                  <DropdownContainer isShowing={showGenerateDropdown}>
                    <div>
                      <Card className="rounded-2xl p-4 flex flex-col justify-center items-center">
                        <div>
                          <p className="text-secondary text-sm">Codes:</p>
                        </div>
                        <div>
                          <Input
                            type="text"
                            value={amountToGenerate}
                            onChange={setAmountToGenerate}
                            placeholder="100"
                          />
                        </div>
                        {renderGenerateWinningCodes()}
                        {renderPointsInputCodes()}
                        <div>
                          <div>
                            <button
                              onClick={handleGenerateCodesClick}
                              className="mt-4 rounded-full bg-yellow-300 px-4 py-2"
                            >
                              Generate
                            </button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </DropdownContainer>
                </div>
              </div>
            </div>
          </div>
          <Card className="inline-flex flex-row flex-wrap rounded-3xl mt-8 justify-center">
            <TextContainer
              number={campaign.totalNumberOfCodes}
              text="generated codes"
            />
            <TextContainer
              number={campaign.numberOfScannedCodes}
              text="scanned codes"
            />
            <TextContainer
              number={campaign.numberOfActiveCodes}
              text="active codes"
            />
            {typeof campaign.numberOfUniquePeopleReached === "number" && (
              <TextContainer
                number={campaign.numberOfUniquePeopleReached}
                text="unique people reached"
              />
            )}
            {renderCardStats()}
          </Card>
          <div>
            {isCampaignScansLoading ? (
              <Icon name="loading" height={40} width={40} />
            ) : (
              <div>
                <div className="flex flex-row mb-3">
                  <div className="flex-1">
                    <h2>Campaign Participants</h2>
                  </div>
                  <div className="relative">
                    <Button color="#f57f51">
                      <div
                        className="px-12 py-4 cursor-pointer select-none"
                        onClick={handleDrawWinnersClick}
                      >
                        Draw Winners
                      </div>
                    </Button>
                    {showDrawWinnersMenu && (
                      <Card className="absolute left-0 right-0 p-2 rounded-md mt-4">
                        <div>Amount of winners:</div>
                        <div>
                          <Input
                            value={amountOfWinnersEntry}
                            type="text"
                            onChange={setAmountOfWinnersEntry}
                          />
                        </div>
                        <div className="mt-3 mb-3">
                          <DataEntry.Checkbox
                            title="Deactivate campaign after the draw"
                            initialState={deactivateCampaignAfterDraw}
                            onChange={setDeactivateCampaignAfterDraw}
                          />
                        </div>
                        <div className="mt-4">
                          <Button>
                            <div
                              onClick={handleDrawWinners}
                              className="px-6 py-3 text-center select-none cursor-pointer"
                            >
                              Draw
                            </div>
                          </Button>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
                {renderCampaignParticipants()}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardContainer>
  );
};

export default Campaign;
