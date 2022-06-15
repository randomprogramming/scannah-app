import DashboardContainerGlobalStyles from "@styles/dashboardContainerGlobalStyles";
import { useRouter } from "next/router";
import React from "react";

const Scanned = () => {
  const router = useRouter();

  function parseQueryCode() {
    let code: number;
    try {
      code = parseInt(router.query.code as string);
    } catch (err) {
      return;
    }

    if (code !== 200) {
      return (
        <div>
          <h2>Failed to scan code:</h2>
        </div>
      );
    }
  }

  return (
    <div className="text-center pt-6">
      <DashboardContainerGlobalStyles />
      {parseQueryCode()}
      {router.query.message && <h3>{router.query.message}</h3>}
      <p className="text-secondary mt-8">You may close this browser window.</p>
    </div>
  );
};

export default Scanned;
