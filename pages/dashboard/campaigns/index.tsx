import Card from "@components/Card";
import Button from "@components/dashboard/Button";
import DashboardContainer from "@components/dashboard/DashboardContainer";
import Icon from "@components/Icon";
import { CampaignTypeBaseInterface } from "@server/models/CampaignType";
import Link from "next/link";
import React from "react";
import useCampaigns from "src/hooks/useCampaigns";
import styled from "styled-components";

interface CampaignContainerProps {
  id: string;
  isActive: boolean;
  name: string;
  totalCodes: number;
  totalScannedCodes: number;
  totalActiveCodes: number;
  campaignTypeTitle: string;
}

const CampaignContainerLink = styled.a`
  transition: all 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  &:hover {
    background-color: #ececec;
  }
`;

function CampaignContainer({
  id,
  isActive,
  name,
  totalCodes,
  totalScannedCodes,
  totalActiveCodes,
  campaignTypeTitle,
}: CampaignContainerProps) {
  return (
    <Card className="rounded-lg overflow-hidden">
      <Link key={id} href={`/dashboard/campaigns/${id}`} passHref>
        <CampaignContainerLink className="h-full w-full px-4 py-2 flex flex-col">
          <div className="h-full w-full flex-1">
            <div className="flex flex-row h-full w-full">
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden mr-1">
                  <h3>{name}</h3>
                </div>
                <div>
                  <h5 className="text-secondary">{campaignTypeTitle}</h5>
                </div>
              </div>
              <div
                style={{
                  height: "16px",
                  width: "16px",
                  borderRadius: "99px",
                  backgroundColor: isActive ? "#03C04A" : "#FD0100",
                  boxShadow: "1px 1px 3px 0px rgba(0,0,0,0.33)",
                  marginTop: "8px",
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-400 mt-16">
            <div className="text-center">
              <h4>{totalCodes}</h4>
              <div>total codes</div>
            </div>
            <div className="text-center">
              <h4>{totalScannedCodes}</h4>
              <div>scanned codes</div>
            </div>
            <div className="text-center">
              <h4>{totalActiveCodes}</h4>
              <div>active codes</div>
            </div>
          </div>
        </CampaignContainerLink>
      </Link>
    </Card>
  );
}

export default function Campaigns() {
  const { campaigns, isLoading } = useCampaigns();

  return (
    <DashboardContainer>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <h1>Your campaigns</h1>
          <p className="text-secondary">
            You can manage your active and inactive campaigns here
          </p>
        </div>
        <div className="self-center">
          <Button>
            <Link href="/dashboard/campaigns/start-new">
              <a className="rounded-full text-white  px-12 py-4 inline-block">
                Start new campaign
              </a>
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        {isLoading ? (
          <Icon name="loading" height={32} width={32} />
        ) : (
          campaigns.map((campaign) => (
            <CampaignContainer
              key={campaign._id.toString()}
              id={campaign._id.toString()}
              isActive={campaign.isActive}
              name={campaign.name}
              totalActiveCodes={campaign.numberOfActiveCodes}
              totalScannedCodes={campaign.numberOfScannedCodes}
              totalCodes={campaign.totalNumberOfCodes}
              campaignTypeTitle={
                (campaign.campaignType as CampaignTypeBaseInterface).title
              }
            />
          ))
        )}
      </div>
    </DashboardContainer>
  );
}
