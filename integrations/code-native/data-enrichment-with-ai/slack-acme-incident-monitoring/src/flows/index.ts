import { createIncident } from "./createIncident";
import { getIncidents } from "./getIncidents";
import { getOnCallStaff } from "./getOnCallStaff";
import { handleSlackEventsAndInteractions } from "./handleSlackEventsAndInteractions";
import { newIncidentAlert } from "./newIncidentAlert";

export default [
  newIncidentAlert,
  handleSlackEventsAndInteractions,
  getIncidents,
  createIncident,
  getOnCallStaff,
];
