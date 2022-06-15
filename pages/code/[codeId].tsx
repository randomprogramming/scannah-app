import DashboardContainer from "@components/dashboard/DashboardContainer";
import Icon from "@components/Icon";
import useCode from "@hooks/useCode";
import { CAMPAIGN_TYPES_ENUM } from "@server/constants";
import { CampaignInterface } from "@server/models/Campaign";
import { CampaignTypeInterface } from "@server/models/CampaignType";
import { useRouter } from "next/router";
import React from "react";

const Code = () => {
  const router = useRouter();

  const { codeData, isLoading, isError } = useCode(
    router.query.codeId as string,
  );

  if (isError) {
    return (
      <DashboardContainer>
        <div className="text-center">
          <h2>Error when fetching code information, please try again.</h2>
        </div>
      </DashboardContainer>
    );
  }

  if (isLoading) {
    return (
      <DashboardContainer>
        <div className="w-full flex justify-center items-center">
          <Icon name="loading" height={32} width={32} />
        </div>
      </DashboardContainer>
    );
  }

  const campaign = codeData.campaign as CampaignInterface;

  const campaignType = campaign.campaignType as CampaignTypeInterface;

  function renderCodeScannedState() {
    if (codeData.isScanned) {
      return (
        <div>
          <p>
            Code <span className="text-green-500 font-bold">is</span> scanned.
          </p>
          <p>
            Code was scanned on:{" "}
            <span className="font-bold">
              {new Date(codeData.dateScanned).toLocaleString()}
            </span>
          </p>
          <p>
            Code was scanned by:{" "}
            <span className="font-bold">
              {/* @ts-expect-error */}
              {codeData.scannedBy.firstName} {/* @ts-expect-error */}
              {codeData.scannedBy.lastName}
            </span>
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <p>
            Code has <span className="text-red-500 font-bold">not</span> been
            scanned yet.
          </p>
        </div>
      );
    }
  }

  function renderCodeRewardsState() {
    switch (campaignType.title) {
      case CAMPAIGN_TYPES_ENUM.luckyTicket:
        return codeData.isWinningCode ? (
          <div>
            Code <span className="text-green-500 font-bold">is</span> a winning
            code.
          </div>
        ) : (
          <div>
            Code is <span className="text-red-500 font-bold">not</span> a
            winning code.
          </div>
        );
      case CAMPAIGN_TYPES_ENUM.pointCollector:
        return (
          <div>
            This code is worth{" "}
            <span className="font-bold">{codeData.points}</span> points.
          </div>
        );

      default:
        return <div />;
    }
  }

  return (
    <DashboardContainer>
      <h4>Hey, it seems that you tried scanning your own code.</h4>
      <p className="text-secondary">
        Instead of scanning the code, we will show you some information about
        the code.
      </p>
      <div className="mt-8">
        <h2 className="break-all">Code ID: {codeData._id}</h2>
        <h3>Campaign: {campaign.name}</h3>
        <h3>Campaign type: {campaignType.title}</h3>
        <h4>
          Campaign is{" "}
          {campaign.isActive ? (
            <span className="text-green-500 font-bold">active</span>
          ) : (
            <span className="text-red-500 font-bold">not active</span>
          )}
        </h4>
      </div>
      <div className="mt-6">{renderCodeScannedState()}</div>
      <div className="mt-6">{renderCodeRewardsState()}</div>
    </DashboardContainer>
  );
};

export default Code;
