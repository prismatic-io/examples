import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  projectColor,
  defaultView,
  dueOn,
  archived,
  followers,
  name,
  notes,
  projectId,
  owner,
  startOn,
  team,
  connectionInput,
  htmlNotes,
  privacySetting,
} from "../../inputs";

export const updateProject = action({
  display: {
    label: "Update Project",
    description: "Update the information and metadata of a project",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const projectData = {
      data: {
        archived: params.archived,
        color: params.projectColor,
        default_view: params.defaultView,
        due_on: params.dueOn,
        followers: params.followers || undefined,
        name: params.name,
        notes: params.notes,
        owner: params.owner || undefined,
        start_on: params.startOn,
        team: params.team || undefined,
        html_notes: params.htmlNotes || undefined,
        privacy_setting: params.privacySetting,
      },
    };
    const { data } = await client.put(
      `/projects/${params.projectId}`,
      projectData
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    projectId,
    projectColor,
    defaultView: { ...defaultView, required: false, default: "" },
    privacySetting,
    dueOn,
    archived,
    followers,
    name,
    notes,
    htmlNotes,
    owner: { ...owner, required: false },
    startOn,
    team,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202461680419124",
        resource_type: "project",
        created_at: "2022-06-16T22:39:52.270Z",
        modified_at: "2022-06-16T22:39:54.373Z",
        due_date: null,
        due_on: null,
        current_status_update: null,
        current_status: null,
        name: "My new project name",
        notes: "My new project notes\n",
        archived: false,
        workspace: {
          gid: "1126509132283071",
          resource_type: "workspace",
          name: "Prismatic",
        },
        team: {
          gid: "1202178854270529",
          resource_type: "team",
          name: "Engineering",
        },
        permalink_url:
          "https://app.asana.com/0/1202461680419124/1202461680419124",
        is_template: false,
        default_view: "board",
        start_on: null,
        color: "light-green",
        icon: "board",
        completed: false,
        completed_at: null,
        completed_by: null,
        owner: {
          gid: "1202178852626547",
          resource_type: "user",
          name: "Example User",
        },
        members: [
          {
            gid: "1202178852626547",
            resource_type: "user",
            name: "Example User",
          },
        ],
        followers: [
          {
            gid: "1202178852626547",
            resource_type: "user",
            name: "Example User",
          },
        ],
      },
    },
  },
});
