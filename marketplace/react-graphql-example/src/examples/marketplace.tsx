import React, { useEffect } from "react";
import prismatic from "@prismatic-io/embedded";

const id = "embedded-marketplace-container";

const EmbeddedMarketplace = () => {
  useEffect(() => {
    prismatic.showMarketplace({
      selector: `#${id}`,
      usePopover: false,
      theme: "LIGHT",
    });
  }, []);

  return (
    <div id={id} style={{ height: "1000px" }}>
      Loading...
    </div>
  );
};

export default EmbeddedMarketplace;
