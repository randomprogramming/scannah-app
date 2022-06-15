import DashboardContainer from "@components/dashboard/DashboardContainer";
import { useAppSelector } from "@redux/store";
import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import Card from "@components/Card";
import styled from "styled-components";
import { ILastWeekScans } from "@server/interfaces/dashboardStats";
import useDashboardStats from "@hooks/useDashboardStats";
import Icon from "@components/Icon";

interface IData {
  id: string;
  data: { x: string; y: number }[];
}

const LastWeekScansLine = ({ data }: { data: IData[] }) => {
  return (
    <ResponsiveLine
      tooltip={(input) => {
        const date = input.point.data.xFormatted;
        const scans = input.point.data.yFormatted;

        return (
          <Card
            className="p-3 rounded-lg text-center"
            style={{ fontWeight: 600 }}
          >
            <div>{date}</div>
            <div>{`${scans} ${
              parseInt(scans as string) === 1 ? "scan" : "scans"
            }`}</div>
          </Card>
        );
      }}
      data={data}
      margin={{ top: 25, right: 50, bottom: 50, left: 50 }}
      xScale={{ type: "time", format: "%Y-%m-%d" }}
      yScale={{
        type: "linear",
        min: 0,
        stacked: true,
        reverse: false,
      }}
      xFormat="time:%Y-%m-%d"
      curve="catmullRom"
      axisBottom={{
        tickValues: "every 1 day",
        tickSize: 0,
        tickPadding: 15,
        format: "%a",
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 15,
        tickValues: 4,
      }}
      colors={["#040404"]}
      lineWidth={5}
      pointSize={20}
      pointColor="#040404"
      pointBorderWidth={3}
      pointBorderColor="lightgray"
      enableCrosshair={false}
      useMesh={true}
      legends={[]}
      enableGridX={true}
      gridXValues={["first"]} // Only show the first line
      enableGridY={true}
      gridYValues={4}
      theme={{
        fontFamily: "Poppins",
        grid: {
          line: {
            strokeDasharray: "6 6",
          },
        },
        axis: {
          ticks: {
            text: {
              fontWeight: 600,
              fontSize: 12,
            },
          },
        },
      }}
    />
  );
};

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px 16px;
  grid-template-areas:
    "Graph Graph Graph Graph"
    "Stats1 Stats2 Stats3 Stats4";
  flex: 1;
`;

const StyledGraphContainer = styled.div`
  grid-area: Graph;
  height: 375px;
`;

export default function Dashboard() {
  const firstName = useAppSelector((state) => state.account.firstName);
  const isBusinessAccount = useAppSelector(
    (state) => state.account.isBusinessAccount,
  );

  const { stats, isLoading, isError } = useDashboardStats();

  const [formattedStats, setFormattedStats] = useState<ILastWeekScans[]>([]);

  // Creates a dummy array of ILastWeekScans objects, since the server
  // might not return a object for each day
  // If a day had 0 scans, it will skip that day
  function getDummyArr(): ILastWeekScans[] {
    function pad(n: number) {
      // Add leading zero
      return n < 10 ? "0" + n : n;
    }

    let dummyArr: ILastWeekScans[] = [];

    const lastWeek = new Date();

    for (let i = 8; i !== 0; i--) {
      dummyArr.push({
        count: 0,
        date: `${pad(lastWeek.getUTCFullYear())}-${pad(
          lastWeek.getUTCMonth() + 1,
        )}-${pad(lastWeek.getUTCDate())}`,
      });

      lastWeek.setDate(lastWeek.getDate() - 1);
    }

    return dummyArr;
  }

  function searchAndInsert(dummy: ILastWeekScans, real: ILastWeekScans[]) {
    const search = real.find((scan) => scan.date === dummy.date);

    if (search) {
      dummy.count = search.count;
    }
  }

  useEffect(() => {
    // Fill dummy arr with data from server
    if (!isError && stats) {
      let dummyArr = getDummyArr();
      dummyArr.forEach((dummy) => searchAndInsert(dummy, stats));

      setFormattedStats(dummyArr);
    }
  }, [stats]);

  if (isLoading) {
    return (
      <DashboardContainer>
        <div className="flex justify-center items-center">
          <Icon name="loading" width={24} height={24} />
        </div>
      </DashboardContainer>
    );
  }

  if (isError) {
    return (
      <DashboardContainer>
        <div className="flex justify-center items-center">
          <h3>Error when loading dashboard.</h3>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <div className="mb-4">
        <h2>Hello {firstName}, welcome to your dashboard</h2>
      </div>
      <StyledGrid>
        <StyledGraphContainer>
          <Card className="w-full h-full rounded-3xl flex flex-col">
            <div className="pt-4 ml-12">
              {isBusinessAccount ? (
                <h3>
                  Number of codes scanned in all your campaigns from the last
                  week
                </h3>
              ) : (
                <h3>Number of codes you've scanned in the last week</h3>
              )}
            </div>
            <div className="flex-1">
              <div className="w-full h-full" style={{ maxHeight: "485px" }}>
                <LastWeekScansLine
                  data={[
                    {
                      id: "scans",
                      data: formattedStats.map((stat) => {
                        return { x: stat.date, y: stat.count };
                      }),
                    },
                  ]}
                />
              </div>
            </div>
          </Card>
        </StyledGraphContainer>
      </StyledGrid>
    </DashboardContainer>
  );
}
