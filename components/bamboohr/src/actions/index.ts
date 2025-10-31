import companyFilesActions from "./companyFiles";
import employeeFilesActions from "./employeeFiles";
import employeeActions from "./employees";
import rawRequestActions from "./rawRequest";
import tabularDataActions from "./tabularData";
import timeOffActions from "./timeOff";
import webhookActions from "./webhooks";

export default {
  ...companyFilesActions,
  ...employeeActions,
  ...employeeFilesActions,
  ...rawRequestActions,
  ...tabularDataActions,
  ...timeOffActions,
  ...webhookActions,
};
