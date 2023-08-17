import { component } from "@prismatic-io/spectral";
import { listProjects } from "./actions/projects/listProjects";
import { listWorkspaces } from "./actions/workspaces/listWorkspaces";
import { findWorkspaceByName } from "./actions/workspaces/findWorkspaceByName";
import { addUser } from "./actions/workspaces/addUserToWorkspace";
import { getWorkspace } from "./actions/workspaces/getWorkspace";
import { createProjects } from "./actions/projects/createProject";
import { updateProject } from "./actions/projects/updateProject";
import { deleteProjects } from "./actions/projects/deleteProject";
import { getProject } from "./actions/projects/getProject";
import { getUsers, getCurrentUser } from "./actions/users/getUser";
import { listUsers } from "./actions/users/listUsers";
import { findUserByNameOrEmail } from "./actions/users/findUserByNameOrEmail";
import { listTasks } from "./actions/tasks/listTasks";
import { createTask } from "./actions/tasks/createTask";
import { deleteTask } from "./actions/tasks/deleteTask";
import { getTask } from "./actions/tasks/getTask";
import { updateTask } from "./actions/tasks/updateTask";
import { addUserToTeam } from "./actions/teams/addUserToTeam";
import { createTeam } from "./actions/teams/createTeam";
import { getTeam } from "./actions/teams/getTeam";
import { listPortfolios } from "./actions/portfolio/listPortfolios";
import { getPortfolio } from "./actions/portfolio/getPortfolio";
import { addCustomFieldToPortfolio } from "./actions/portfolio/addCustomFieldToPortfolio";
import { removeCustomFieldFromPortfolio } from "./actions/portfolio/removeCustomFieldFromPortfolio";
import { createPortfolio } from "./actions/portfolio/createPortfolio";
import { deletePortfolio } from "./actions/portfolio/deletePortfolio";
import { addUserToPortfolio } from "./actions/portfolio/addUserToPortfolio";
import { removeUserFromPortfolio } from "./actions/portfolio/removeUserFromPortfolio";
import { updatePortfolio } from "./actions/portfolio/updatePortfolio";
import { createTag } from "./actions/tags/createTag";
import { deleteTag } from "./actions/tags/deleteTag";
import { getTag } from "./actions/tags/getTag";
import { listTags } from "./actions/tags/listTags";
import { findTagByName } from "./actions/tags/findTagByName";
import { listTagsInTask } from "./actions/tags/listTagsInTask";
import { updateTag } from "./actions/tags/updateTag";
import { listSubtasks } from "./actions/subtasks/listSubtasks";
import { addTaskToSection } from "./actions/sections/addtaskToSection";
import { createSection } from "./actions/sections/createSection";
import { deleteSection } from "./actions/sections/deleteSection";
import { getSection } from "./actions/sections/getSection";
import { listSections } from "./actions/sections/listSections";
import { updateSection } from "./actions/sections/updateSection";
import { removeCustomFieldFromProject } from "./actions/projects/removeCustomField";
import { addUserToProject } from "./actions/projects/addUserToProject";
import { addCustomFieldToProject } from "./actions/projects/addCustomField";
import { listPortfolioItems } from "./actions/items/listPortfolioItems";
import { removePortfolioItem } from "./actions/items/removePortfolioItem";
import { getCustomField } from "./actions/customFields/getCustomField";
import { listCustomFields } from "./actions/customFields/listCustomFields";
import { deleteAttachment } from "./actions/attachments/deleteAttachment";
import { getAttachment } from "./actions/attachments/getAttachment";
import { listAttachments } from "./actions/attachments/listAttachments";
import { attachFileToTask } from "./actions/attachments/attachFileToTask";
import { addFollowersToTask } from "./actions/tasks/addFollowersToTask";
import { removeFollowersFromTask } from "./actions/tasks/removeFollowersFromTask";
import { addTagToTask } from "./actions/tasks/addTagToTask";
import { removeTagFromTask } from "./actions/tasks/removeTagFromTask";
import { listTeams } from "./actions/teams/listTeamsInWorkspace";
import { findTeamByName } from "./actions/teams/findTeamByName";
import { createStatusUpdate } from "./actions/status-update/createStatusUpdate";
import { deleteStatus } from "./actions/status-update/deleteStatus";
import { getStatusesForObject } from "./actions/status-update/getStatusesForObject";
import { getStatusUpdate } from "./actions/status-update/getStatusUpdate";
import webhookActions from "./actions/webhooks";
import dataSources from "./dataSources";
import triggers from "./triggers";

import connections from "./connections";
import { handleErrors } from "@prismatic-io/spectral/dist/clients/http";
import rawRequest from "./actions/rawRequest";

export default component({
  key: "asana",
  public: true,
  documentationUrl: "https://prismatic.io/docs/components/asana/",
  display: {
    category: "Application Connectors",
    label: "Asana",
    description: "Manage users, projects, and teams in your Asana workspace",
    iconPath: "icon.png",
  },
  actions: {
    listProjects,
    listWorkspaces,
    findWorkspaceByName,
    addUser,
    getWorkspace,
    createProjects,
    updateProject,
    deleteProjects,
    getUsers,
    getCurrentUser,
    listUsers,
    findUserByNameOrEmail,
    listTasks,
    getProject,
    createTask,
    deleteTask,
    getTask,
    updateTask,
    addUserToTeam,
    createTeam,
    getTeam,
    listPortfolios,
    getPortfolio,
    addCustomFieldToPortfolio,
    removeCustomFieldFromPortfolio,
    deletePortfolio,
    createPortfolio,
    addUserToPortfolio,
    removeUserFromPortfolio,
    updatePortfolio,
    createTag,
    deleteTag,
    getTag,
    listTags,
    findTagByName,
    listTagsInTask,
    updateTag,
    listSubtasks,
    addTaskToSection,
    createSection,
    deleteSection,
    getSection,
    listSections,
    updateSection,
    removeCustomFieldFromProject,
    addUserToProject,
    addCustomFieldToProject,
    listPortfolioItems,
    removePortfolioItem,
    listCustomFields,
    getCustomField,
    deleteAttachment,
    getAttachment,
    listAttachments,
    attachFileToTask,
    addFollowersToTask,
    removeFollowersFromTask,
    addTagToTask,
    removeTagFromTask,
    listTeams,
    findTeamByName,
    createStatusUpdate,
    deleteStatus,
    getStatusesForObject,
    getStatusUpdate,
    rawRequest,
    ...webhookActions,
  },
  triggers,
  dataSources,
  hooks: { error: handleErrors },
  connections,
});
