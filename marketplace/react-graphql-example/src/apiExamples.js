import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState } from "react";
import MarketplaceIntegrations from "./examples/marketplaceIntegrations";
import ListInstances from "./examples/listInstances";
import DeployDropbox from "./examples/deployDropbox";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ApiExamples() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Marketplace Integrations" {...a11yProps(0)} />
          <Tab label="List My Instances" {...a11yProps(1)} />
          <Tab label="Deploy Dropbox" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <MarketplaceIntegrations />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ListInstances />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DeployDropbox />
      </TabPanel>
    </Box>
  );
}
