const colorOptions = [
  "dark-blue",
  "dark-brown",
  "dark-green",
  "dark-orange",
  "dark-pink",
  "dark-purple",
  "dark-red",
  "dark-teal",
  "dark-warm-gray",
  "light-blue",
  "light-green",
  "light-orange",
  "light-pink",
  "light-purple",
  "light-red",
  "light-teal",
  "light-warm-gray",
  "light-yellow",
];

export const colorInputOptions = colorOptions.map((color) => ({
  label: color,
  value: color,
}));

export const TASK_OPT_FIELDS =
  "projects,resource_subtype,assignee,assignee_status,created_at,completed,gid,resource_type,completed_at,dependencies,custom_fields,dependents,due_on,due_at,followers,external,is_rendered_as_separator,liked,likes,memberships,modified_at,name,notes,html_notes,num_likes,num_subtasks,parent,start_at,start_on,workspace,tags";

export const PROJECT_OPT_FIELDS =
  "layout,team,workspace,html_notes,notes,color,custom_field_settings,custom_fields,followers,members,public,archived,modified_at,created_at,start_on,due_on,current_status,owner,name,resource_type,gid,completed,completed_at";

export const CUSTOM_FIELD_OPT_FIELDS =
  "precision,enum_options,description,name,resource_subtype,resource_type,gid,text_value";

export const SECTION_OPT_FIELDS = "created_at,project,name,resource_type,gid";

export const TAG_OPT_FIELDS =
  "resource_type,gid,created_at,followers,name,color,workspace,notes";
