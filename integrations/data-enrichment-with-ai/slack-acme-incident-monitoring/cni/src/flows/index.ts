import { newIncidentAlert } from "./newIncidentAlert";
import { handleSlackEventsAndInteractions } from "./handleSlackEventsAndInteractions";
import { getIncidents } from "./getIncidents";
import { createIncident } from "./createIncident";
import { getOnCallStaff } from "./getOnCallStaff";

export default [
  newIncidentAlert,
  handleSlackEventsAndInteractions,
  getIncidents,
  createIncident,
  getOnCallStaff,
];
