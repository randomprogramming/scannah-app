import Button from "@components/dashboard/Button";
import DashboardContainer from "@components/dashboard/DashboardContainer";
import DataEntry from "@components/DataEntry";
import Icon from "@components/Icon";
import Input from "@components/Input";
import {
  createCampaign,
  fetchCampaignTypes,
} from "@redux/actions/campaignActions";
import {
  setAllowMultipleEntries,
  setName,
  setSelectedCampaignTypeId,
} from "@redux/slices/campaignSlice";
import { useAppDispatch, useAppSelector } from "@redux/store";
import { CAMPAIGN_TYPES_ENUM } from "@server/constants";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";

const CONTENT_WIDTH = "285px";

interface StyledInterfaces {
  isActive: boolean;
}

const StyledTypeContainer = styled.div<StyledInterfaces>`
  width: ${CONTENT_WIDTH};
  border-radius: 8px;
  border-width: 2px;
  border-style: solid;
  user-select: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;

  border-color: ${(props) =>
    props.isActive
      ? props.theme.colors.dashboardAccent
      : props.theme.colors.lightGray};

  &:hover {
    border-color: ${(props) => !props.isActive && props.theme.colors.darkGray};
  }
`;

const StyledSelectedContainer = styled.div<StyledInterfaces>`
  height: 16px;
  width: 16px;
  border-radius: 4px;
  border: 2px solid ${(props) => props.theme.colors.lightGray};
  transition: all 0.2s ease-in-out;

  background-color: ${(props) =>
    props.isActive ? props.theme.colors.dashboardAccent : "transparent"};

  ${StyledTypeContainer}:hover & {
    border-color: ${(props) => props.theme.colors.darkGray};
  }
`;

interface CampaignTypeContainerProps {
  _id: string;
  title: string;
  description: string;
  onClick(): void;
  activeId: string;
}

function CampaignTypeContainer({
  _id,
  title,
  description,
  onClick,
  activeId,
}: CampaignTypeContainerProps) {
  const allowsMultipleEntries = useAppSelector(
    (state) => state.campaign.giveawayAllowsMultipleEntries,
  );

  const dispatch = useAppDispatch();

  return (
    <StyledTypeContainer onClick={onClick} isActive={activeId === _id}>
      <div className="flex flex-row items-center">
        <StyledSelectedContainer isActive={activeId === _id} />
        <div className="font-medium ml-2">{title}</div>
      </div>
      <div
        style={{
          display: activeId === _id ? "block" : "none",
        }}
      >
        {description}
        <div className="mt-3">
          {title === CAMPAIGN_TYPES_ENUM.giveaway && (
            <DataEntry.Checkbox
              title="Allow multiple entries"
              initialState={allowsMultipleEntries}
              onChange={(newVal) => {
                dispatch(setAllowMultipleEntries(newVal));
              }}
            />
          )}
        </div>
      </div>
    </StyledTypeContainer>
  );
}

export default function CreateNewCampaign() {
  const name = useAppSelector((state) => state.campaign.name);
  const campaignTypes = useAppSelector((state) => state.campaign.campaignTypes);
  const selectedCampaignTypeId = useAppSelector(
    (state) => state.campaign.selectedCampaignTypeId,
  );
  const isCreatingCampaign = useAppSelector(
    (state) => state.campaign.isCreatingCampaign,
  );
  const errorWhenCreatingCampaign = useAppSelector(
    (state) => state.campaign.errorWhenCreatingCampaign,
  );
  const messageOnCreatedCampaign = useAppSelector(
    (state) => state.campaign.messageOnCreatedCampaign,
  );

  const dispatch = useAppDispatch();

  const router = useRouter();

  function onNewCampaignCreate(newCampaignId: string) {
    router.push("/dashboard/campaigns/" + newCampaignId);
  }

  function handleNameChange(newVal: string): void {
    dispatch(setName(newVal));
  }

  function handleCreateNewCampaign(): void {
    dispatch(createCampaign(onNewCampaignCreate));
  }

  useEffect(() => {
    dispatch(fetchCampaignTypes());
  }, []);

  return (
    <DashboardContainer>
      <div className="flex flex-col items-center space-y-16">
        <div>
          <h3>Name your new Campaign</h3>
          <div>
            <Input
              type="text"
              value={name}
              onChange={handleNameChange}
              style={{ width: CONTENT_WIDTH, backgroundColor: "transparent" }}
              placeholder="PlayStation™ Giveaway"
            />
          </div>
        </div>
        <div>
          <h3>Choose a Campaign type</h3>
          <div className="space-y-6 mt-3">
            {campaignTypes.map((type) => (
              <CampaignTypeContainer
                key={type._id}
                {...type}
                onClick={() => dispatch(setSelectedCampaignTypeId(type._id))}
                activeId={selectedCampaignTypeId}
              />
            ))}
          </div>
        </div>
        {isCreatingCampaign ? (
          <Icon name="loading" width={24} height={24} />
        ) : (
          <div
            className={`${
              errorWhenCreatingCampaign ? "text-red-600" : "text-green-500"
            } font-bold`}
          >
            <p>{messageOnCreatedCampaign}</p>
          </div>
        )}
        <div>
          <Button onClick={handleCreateNewCampaign} title="Create Campaign" />
        </div>
      </div>
    </DashboardContainer>
  );
}
