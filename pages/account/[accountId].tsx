import Card from "@components/Card";
import Icon from "@components/Icon";
import { useCustomSnackbar } from "@hooks/useCustomSnackbar";
import {
  getCampaignParticipation,
  redeemParticipation,
} from "@redux/actions/noDispatchActions";
import { useAppSelector } from "@redux/store";
import { CAMPAIGN_TYPES_ENUM } from "@server/constants";
import { CampaignInterface } from "@server/models/Campaign";
import {
  CampaignPropsInterface,
  GiveawayCampaignProps,
  LuckyTicketCampaignProps,
  PointCollectorCampaignProps,
} from "@server/models/CampaignProps";
import { CampaignTypeBaseInterface } from "@server/models/CampaignType";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";

export default function AccountId() {
  const router = useRouter();

  const account = useAppSelector((state) => state.account);

  const [campaignParticipationData, setCampaignParticipationData] = useState<
    CampaignPropsInterface[]
  >([]);
  const [openMenuId, setOpenMenuId] = useState("");
  const [
    isLoadingCampaignParticipationData,
    setIsLoadingCampaignParticipationData,
  ] = useState(false);
  const [participantName, setParticipantName] = useState("");

  const pointCollectorInputRef = useRef<HTMLInputElement>();

  // This is the ID of the participant
  const { accountId } = router.query;

  const openSnackbar = useCustomSnackbar();

  async function fetchCampaignParticipationData() {
    if (
      account.isLoggedIn &&
      account.isBusinessAccount &&
      typeof accountId === "string"
    ) {
      setIsLoadingCampaignParticipationData(true);
      const data = await getCampaignParticipation(accountId);
      setCampaignParticipationData(data.campaignParticipation);
      setParticipantName(data.accountName);
      setIsLoadingCampaignParticipationData(false);
    }
  }

  async function handleGiveawayRedeem(campaignPropsId: any) {
    try {
      if (
        await redeemParticipation(
          CAMPAIGN_TYPES_ENUM.giveaway,
          campaignPropsId,
          accountId as string,
        )
      ) {
        fetchCampaignParticipationData();
        openSnackbar("Giveaway entries redeemed.", "success");
      } else {
        openSnackbar("Unable to redeem giveaway entries.", "warning");
      }
    } catch (err) {
      openSnackbar(err.response.data.message, "warning");
    }
  }

  async function handlePointCollectorRedeem(campaignPropsId: any) {
    if (pointCollectorInputRef && pointCollectorInputRef.current) {
      try {
        if (
          await redeemParticipation(
            CAMPAIGN_TYPES_ENUM.pointCollector,
            campaignPropsId,
            accountId as string,
            pointCollectorInputRef.current.value,
          )
        ) {
          fetchCampaignParticipationData();
          openSnackbar("Collected points redeemed.", "success");
        } else {
          openSnackbar("Unable to redeem points.", "warning");
        }
      } catch (err) {
        openSnackbar(err.response.data.message, "warning");
      }
    }
  }

  async function handleLuckyTicketRedeem(campaignPropsId: any) {
    try {
      if (
        await redeemParticipation(
          CAMPAIGN_TYPES_ENUM.luckyTicket,
          campaignPropsId,
          accountId as string,
        )
      ) {
        fetchCampaignParticipationData();
        openSnackbar("Lucky ticket redeemed.", "success");
      } else {
        openSnackbar("Unable to redeem lucky ticket.", "warning");
      }
    } catch (err) {
      openSnackbar(err.response.data.message, "warning");
    }
  }

  useEffect(() => {
    fetchCampaignParticipationData();
  }, [account.isLoggedIn, account.isBusinessAccount, accountId]);

  if (!account.isBusinessAccount) {
    return (
      <div className="w-full text-center mt-8">
        <h4>You will need a business account for this functionality.</h4>
      </div>
    );
  }

  if ((account._id as unknown as string) === accountId) {
    return (
      <div className="w-full text-center mt-8">
        <h4>It seems that you scanned your own code.</h4>
      </div>
    );
  }

  function renderParticipatedCampaigns() {
    function CampaignParticipationCard({ children, campaign, campaignProps }) {
      return (
        <Card
          className={`p-4 rounded-md relative cursor-pointer select-none flex flex-col`}
          style={
            openMenuId === campaignProps._id
              ? { border: "3px solid #FF6347" }
              : { border: "3px solid transparent" }
          }
          onClick={() => {
            setOpenMenuId(campaignProps._id);
          }}
        >
          <div className="flex-1">
            <h3 className="break-words">{campaign.name}</h3>
            <h4>{campaign.campaignType.title} Campaign</h4>
            <h5>
              {campaign.isActive
                ? "Campaign is active"
                : "Campaign is NOT active"}
            </h5>
          </div>
          <div className="mt-4">{children}</div>
        </Card>
      );
    }

    function AbsoluteDropdown({ campaignPropsId, children }) {
      return (
        <div
          className="flex flex-col cursor-default border border-solid border-gray-600 absolute transition-all p-4 bg-gray-200 rounded-lg shadow-md z-10"
          style={
            campaignPropsId === openMenuId
              ? { scale: "1", visibility: "visible" }
              : { scale: "0", visibility: "hidden" }
          }
        >
          <div
            className="self-end cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId("");
            }}
          >
            <Icon name="cancel" color="#040404" height={24} width={24} />
          </div>
          <div>{children}</div>
        </div>
      );
    }

    return campaignParticipationData.map((campaignProps) => {
      const campaign = campaignProps.campaign as CampaignInterface;
      const campaignType = campaign.campaignType as CampaignTypeBaseInterface;

      switch (campaignType.title) {
        case CAMPAIGN_TYPES_ENUM.giveaway:
          const campaignPropsGiveaway = campaignProps as GiveawayCampaignProps;

          return (
            <CampaignParticipationCard
              campaignProps={campaignProps}
              campaign={campaign}
              key={campaignPropsGiveaway._id}
            >
              <div>
                User has {campaignPropsGiveaway.giveawayEntries} giveaway
                entries.
              </div>
              <div>
                {campaignPropsGiveaway.isWinner ? (
                  <p className="text-red-600 font-bold">User is not winner.</p>
                ) : (
                  <p className="text-green-400 font-bold">User is winner.</p>
                )}
              </div>
              <div>
                {campaignPropsGiveaway.isRedeemed ? (
                  <p className="text-red-600 font-bold">Redeemed.</p>
                ) : (
                  <p className="text-green-400 font-bold">Not redeemed.</p>
                )}
              </div>
              <AbsoluteDropdown campaignPropsId={campaignProps._id}>
                <p>
                  Redeem the users giveaway entries. If this campaign is still
                  active, and the users scans more codes from this campaign,
                  they will start collecting giveaway entries from 0 again.
                </p>
                <div className="inline-block">
                  {!campaignPropsGiveaway.isRedeemed && (
                    <button
                      onClick={() => handleGiveawayRedeem(campaignProps._id)}
                      className="bg-red-600 px-8 py-4 rounded-full text-white font-bold"
                    >
                      Redeem
                    </button>
                  )}
                </div>
              </AbsoluteDropdown>
            </CampaignParticipationCard>
          );
        case CAMPAIGN_TYPES_ENUM.pointCollector:
          const campaignPropsPointCollector =
            campaignProps as PointCollectorCampaignProps;

          return (
            <CampaignParticipationCard
              campaignProps={campaignProps}
              campaign={campaign}
              key={campaignPropsPointCollector._id}
            >
              <div>
                User has {campaignPropsPointCollector.collectedPoints} collected
                points.
              </div>
              <AbsoluteDropdown campaignPropsId={campaignProps._id}>
                <div>
                  <p>Enter amount of points to redeem:</p>
                </div>
                <input
                  className="p-2 rounded-md"
                  type="text"
                  ref={pointCollectorInputRef}
                  placeholder="50"
                />
                {campaignPropsPointCollector.collectedPoints > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        handlePointCollectorRedeem(campaignProps._id);
                      }}
                      className="bg-red-600 px-8 py-4 rounded-full text-white font-bold"
                    >
                      Redeem
                    </button>
                  </div>
                )}
              </AbsoluteDropdown>
            </CampaignParticipationCard>
          );

        case CAMPAIGN_TYPES_ENUM.luckyTicket:
          const campaignPropsLuckyTicket =
            campaignProps as LuckyTicketCampaignProps;

          let numberOfWins = 0;
          for (const winningTicket of campaignPropsLuckyTicket.scannedWinningTickets) {
            if (
              (winningTicket.winningAccount as unknown as string) ==
                accountId &&
              !winningTicket.isRedeemed
            ) {
              numberOfWins++;
            }
          }

          return (
            <CampaignParticipationCard
              campaignProps={campaignProps}
              campaign={campaign}
              key={campaignPropsLuckyTicket._id}
            >
              <div>User has scanned {numberOfWins} winning codes.</div>
              <AbsoluteDropdown campaignPropsId={campaignProps._id}>
                <p>
                  Redeem the users winning code. You can only redeem one winning
                  code at a time.
                </p>
                {numberOfWins > 0 && (
                  <div className="inline-block">
                    <button
                      onClick={() => {
                        handleLuckyTicketRedeem(campaignProps._id);
                      }}
                      className="bg-red-600 px-8 py-4 rounded-full text-white font-bold"
                    >
                      Redeem
                    </button>
                  </div>
                )}
              </AbsoluteDropdown>
            </CampaignParticipationCard>
          );
        default:
          return <div>Other Campaign</div>;
      }
    });
  }

  return (
    <div className="p-8">
      <h3>
        {participantName}{" "}
        <span style={{ fontWeight: 400 }}>
          has participated in the following campaigns:
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-8 mt-4">
        {isLoadingCampaignParticipationData ? (
          <Icon name="loading" width={32} height={32} />
        ) : (
          renderParticipatedCampaigns()
        )}
      </div>
    </div>
  );
}
