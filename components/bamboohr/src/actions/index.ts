import companyFilesActions from "./companyFiles";
import employeeActions from "./employees";
import employeeFilesActions from "./employeeFiles";
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
