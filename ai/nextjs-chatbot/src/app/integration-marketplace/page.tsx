"use client";

import prismatic from "@prismatic-io/embedded";
import { useEffect } from "react";

const prismaticMarketplaceId = "prismatic-marketplace";

export default function IntegrationMarketplace() {
  useEffect(() => {
    async function loadPrismatic() {
      const tokenResponse = await fetch("/api/prismatic-auth");
      const data = await tokenResponse.json();
      try {
        prismatic.init({
          prismaticUrl: data.prismaticUrl,
        });
        await prismatic.authenticate({ token: data.token });
      } catch (error) {
        alert(`Prismatic authentication failed: ${error}`);
        return;
      }
      prismatic.showMarketplace({
        selector: `#${prismaticMarketplaceId}`,
        theme: "DARK",
      });
    }
    loadPrismatic();
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Integration Marketplace</h1>
      <div className="w-full h-full max-w-6xl min-h-fit">
        <div id={prismaticMarketplaceId} style={{ height: "800px" }}></div>
      </div>
    </div>
  );
}
